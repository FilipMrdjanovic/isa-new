package isa.controller;

import io.jsonwebtoken.Jwts;
import isa.payload.request.AuthenticationRequest;
import isa.payload.request.RegisterRequest;
import isa.payload.response.AuthenticationResponse;
import isa.security.service.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        return service.register(request);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(@RequestBody AuthenticationRequest request) {
        return service.authenticate(request);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestParam("token") String token) {
        return service.refreshToken(token);
    }

    @RequestMapping("/verify")
    public ResponseEntity<?> verifyAccount(@RequestParam("email") String email, @RequestParam("code") String code) {
        return service.verify(email, code);
    }
}