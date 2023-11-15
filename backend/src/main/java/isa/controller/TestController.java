package isa.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping(value = "/api/auth")
@RequiredArgsConstructor
public class TestController {

    @GetMapping("/test")
    public ResponseEntity<?> getFullResponse() {
        return new ResponseEntity<>(HttpStatusCode.valueOf(401));
    }
}
