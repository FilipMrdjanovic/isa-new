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
import isa.security.handler.GlobalExceptionHandler;
import isa.service.mailing.EmailSender;
import jakarta.servlet.http.HttpServletResponse;
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

import java.util.Map;
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
    private final GlobalExceptionHandler globalExceptionHandler;

    public ResponseEntity<?> register(RegisterRequest request) {
        try {
            if (repository.existsByEmail(request.getEmail())) {
                return ResponseEntity.ok(
                        Map.of(
                                "status", 400,
                                "message", "Email is already registered"
                        )
                );
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

            return ResponseEntity.ok(
                    Map.of(
                            "status", 200,
                            "message", "Registration successful. To sign in, activate your account using the link sent to your email"
                    )
            );
        } catch (Exception e) {

            return ResponseEntity.ok(
                    Map.of(
                            "status", 500,
                            "message", e.getMessage()
                    )
            );
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
                    Map.of(
                            "status", 200,
                            "message", "Login successful",
                            "token", jwtToken
                    )
            );
        } catch (AuthenticationException e) {
            var user = repository.findByEmail(request.getEmail());
            if (user.isPresent()) {
                var _user = user.get();
                if (!_user.getEnabled()) {
                    return ResponseEntity.ok(
                            Map.of(
                                    "status", 400, "message",
                                    "Account not verified. Please verify your email first"
                            )
                    );
                }
            }
            return ResponseEntity.ok(
                    Map.of(
                            "status", 400,
                            "message", "Invalid credentials"
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.ok(
                    Map.of(
                            "status", 500,
                            "message", e.getMessage()
                    )
            );
        }
    }

    private String generateVerificationCode() {
        return UUID.randomUUID().toString().substring(0, 6);
    }

    private void sendVerificationEmail(User user, String verificationCode) {
        emailSender.sendConfirmation(user.getEmail(), user.getFirstname(), verificationCode);
    }

    public ResponseEntity<?> verify(String email, String code) {
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
            jwtService.verifyToken(expiredToken);
            User user = getUserFromExpiredToken(expiredToken);
            String newAccessToken = generateAndSaveNewAccessToken(user);

            return ResponseEntity.ok(
                    Map.of(
                            "status", 200,
                            "message", "Token refreshed successfully",
                            "newToken", newAccessToken
                    )
            );
        } catch (Exception e) {
            return ResponseEntity.ok(
                    Map.of(
                            "status", 500,
                            "message", e.getMessage()
                    )
            );
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
}