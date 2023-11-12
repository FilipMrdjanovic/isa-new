package isa.security.service;

import io.jsonwebtoken.ExpiredJwtException;
import isa.model.Role;
import isa.model.Token;
import isa.model.TokenType;
import isa.model.User;
import isa.payload.request.AuthenticationRequest;
import isa.payload.request.RegisterRequest;
import isa.payload.response.AuthenticationResponse;
import isa.repository.TokenRepository;
import isa.repository.UserRepository;
import isa.service.mailing.EmailSender;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.ModelAndView;

import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailSender emailSender;

    public ResponseEntity<?> register(RegisterRequest request) {
        try {
            if (repository.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest().body("Email is already registered.");
            }

            Role role = switch (request.getRole()) {
                case "COMPANY_ADMIN" -> Role.COMPANY_ADMIN;
                case "SYSTEM_ADMIN" -> Role.SYSTEM_ADMIN;
                default -> Role.USER;
            };

            var user = User.builder()
                    .firstname(request.getFirstname())
                    .lastname(request.getLastname())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(role)
                    .city(request.getCity())
                    .country(request.getCountry())
                    .phone(request.getPhone())
                    .occupation(request.getOccupation())
                    .organization(request.getOrganization())
                    .locked(false)
                    .enabled(false)
                    .build();

            String verificationCode = generateVerificationCode();
            user.setVerificationCode(verificationCode);

            var savedUser = repository.save(user);
            var jwtToken = jwtService.generateToken(user);
            var refreshToken = jwtService.generateRefreshToken(user);
            saveUserToken(savedUser, jwtToken);

            var verificationLink = "http://localhost:8080/api/auth/verify?email=" + user.getEmail() + "&code=" + verificationCode;

            sendVerificationEmail(savedUser, verificationLink);

            return ResponseEntity.ok("Registration successful. To sign in, activate your account using the link sent to your email.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred during registration: " + e.getMessage());
        }
    }

    public ResponseEntity<?> authenticate(AuthenticationRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            var user = repository.findByEmail(request.getEmail())
                    .orElseThrow();

            var jwtToken = jwtService.generateToken(user);
            var refreshToken = jwtService.generateRefreshToken(user);
            revokeAllUserTokens(user);
            saveUserToken(user, jwtToken);

            return ResponseEntity.ok(
                    AuthenticationResponse.builder()
                            .id(user.getId())  // Include the user's ID in the response
                            .accessToken(jwtToken)
                            .refreshToken(refreshToken)
                            .role(user.getRole().toString())  // Include the user's role in the response
                            .build()
            );
        } catch (AuthenticationException e) {
            var user = repository.findByEmail(request.getEmail());
            if (user.isPresent()){
                var _user = user.get();
                if (!_user.getEnabled()) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body("Account not verified. Please verify your email first.");
                }
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid credentials. Please check your email and password.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred during authentication: " + e.getMessage());
        }
    }

    private String generateVerificationCode() {
         return UUID.randomUUID().toString().substring(0, 6);
    }
    private void sendVerificationEmail(User user, String verificationCode) {
        emailSender.send(user.getEmail(), buildEmail(user.getFirstname(), verificationCode));
    }

    public ResponseEntity<?> verify(String email, String code){
        var user = repository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (user.getVerificationCode().equals(code)) {
            // Activate the account
            user.setEnabled(true);
            repository.save(user);

            // Return ModelAndView for success page
            ModelAndView modelAndView = new ModelAndView("verification-success");
            modelAndView.addObject("message", "Account verified successfully. You can now log in.");
            return new ResponseEntity<>(modelAndView.getModel(), HttpStatus.OK);
        } else {
            // Return ModelAndView for error page
            ModelAndView modelAndView = new ModelAndView("verification-fail");
            modelAndView.addObject("message", "Invalid verification code.");
            return new ResponseEntity<>(modelAndView.getModel(), HttpStatus.BAD_REQUEST);
        }
    }

    private void saveUserToken(User user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    public ResponseEntity<?> refreshToken(String expiredToken) {
        try {

            User user = getUserFromExpiredToken(expiredToken);
            String newAccessToken = generateAndSaveNewAccessToken(user);

            return ResponseEntity.ok(newAccessToken);
        } catch (ExpiredJwtException e) {
            return ResponseEntity.badRequest().body("Token has expired and cannot be refreshed.");
        }
    }

    private User getUserFromExpiredToken(String expiredToken) {
        String userEmail = jwtService.extractUsername(expiredToken);
        return repository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    private String generateAndSaveNewAccessToken(User user) {
        String newAccessToken = jwtService.generateToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, newAccessToken);
        return newAccessToken;
    }

    private String buildEmail(String name, String link) {
        return "<div style=\"font-family:Helvetica,Arial,sans-serif;font-size:16px;margin:0;color:#0b0c0c\">\n" +
                "\n" +
                "<span style=\"display:none;font-size:1px;color:#fff;max-height:0\"></span>\n" +
                "\n" +
                "  <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;min-width:100%;width:100%!important\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
                "    <tbody><tr>\n" +
                "      <td width=\"100%\" height=\"53\" bgcolor=\"#0b0c0c\">\n" +
                "        \n" +
                "        <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;max-width:580px\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" align=\"center\">\n" +
                "          <tbody><tr>\n" +
                "            <td width=\"70\" bgcolor=\"#0b0c0c\" valign=\"middle\">\n" +
                "                <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n" +
                "                  <tbody><tr>\n" +
                "                    <td style=\"padding-left:10px\">\n" +
                "                  \n" +
                "                    </td>\n" +
                "                    <td style=\"font-size:28px;line-height:1.315789474;Margin-top:4px;padding-left:10px\">\n" +
                "                      <span style=\"font-family:Helvetica,Arial,sans-serif;font-weight:700;color:#ffffff;text-decoration:none;vertical-align:top;display:inline-block\">Confirm your email</span>\n" +
                "                    </td>\n" +
                "                  </tr>\n" +
                "                </tbody></table>\n" +
                "              </a>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "        </tbody></table>\n" +
                "        \n" +
                "      </td>\n" +
                "    </tr>\n" +
                "  </tbody></table>\n" +
                "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n" +
                "    <tbody><tr>\n" +
                "      <td width=\"10\" height=\"10\" valign=\"middle\"></td>\n" +
                "      <td>\n" +
                "        \n" +
                "                <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n" +
                "                  <tbody><tr>\n" +
                "                    <td bgcolor=\"#1D70B8\" width=\"100%\" height=\"10\"></td>\n" +
                "                  </tr>\n" +
                "                </tbody></table>\n" +
                "        \n" +
                "      </td>\n" +
                "      <td width=\"10\" valign=\"middle\" height=\"10\"></td>\n" +
                "    </tr>\n" +
                "  </tbody></table>\n" +
                "\n" +
                "\n" +
                "\n" +
                "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n" +
                "    <tbody><tr>\n" +
                "      <td height=\"30\"><br></td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "      <td style=\"font-family:Helvetica,Arial,sans-serif;font-size:19px;line-height:1.315789474;max-width:560px\">\n" +
                "        \n" +
                "            <p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\">Hi " + name + ",</p><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\"> Thank you for registering. Please click on the below link to activate your account: </p><blockquote style=\"Margin:0 0 20px 0;border-left:10px solid #b1b4b6;padding:15px 0 0.1px 15px;font-size:19px;line-height:25px\"><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\"> <a href=\"" + link + "\">Activate Now</a> </p></blockquote>\n Link will expire in 15 minutes. <p>See you soon</p>" +
                "        \n" +
                "      </td>\n" +
                "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "      <td height=\"30\"><br></td>\n" +
                "    </tr>\n" +
                "  </tbody></table><div class=\"yj6qo\"></div><div class=\"adL\">\n" +
                "\n" +
                "</div></div>";
    }
}