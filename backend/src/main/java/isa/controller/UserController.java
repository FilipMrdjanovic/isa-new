package isa.controller;

import isa.model.User;
import isa.payload.request.UpdateForm;
import isa.payload.request.UpdatePasswordRequest;
import isa.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal User currentUser) {
        User user = service.getUserById(currentUser.getId());
        if (user != null) {
            return ResponseEntity.ok(
                    Map.of(
                            "status", 200,
                            "message", "User found",
                            "user", user
                    )
            );
        } else {
            return ResponseEntity.ok(
                    Map.of("status", 404, "message", "User not found")
            );
        }
    }

    @GetMapping("/user-data")
    public ResponseEntity<?> getUserData(@AuthenticationPrincipal User currentUser) {
        User user = service.getUserById(currentUser.getId());
        if (user != null) {
            return ResponseEntity.ok(
                    Map.of(
                            "status", 200,
                            "message", "User found",
                            "id", user.getId(),
                            "role", user.getRole()
                    )
            );
        } else {
            return ResponseEntity.ok(
                    Map.of("status", 404, "message", "User not found")
            );
        }
    }

    @GetMapping("/rank")
    public ResponseEntity<?> getUserRank(@AuthenticationPrincipal User currentUser) {
        ResponseEntity<?> response = service.getUserRank(currentUser.getId());
        return  response;
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUserData(@AuthenticationPrincipal User currentUser, @RequestBody UpdateForm updatedUser) {
        User updated = service.updateUser(currentUser.getId(), updatedUser);
        if (updated != null) {
            return ResponseEntity.ok(
                    Map.of("status", 200, "message", "User data updated successfully", "user", updated)
            );
        } else {
            return ResponseEntity.ok(
                    Map.of("status", 400, "message", "Failed to update user data")
            );
        }
    }

    @PutMapping("/update/password")
    public ResponseEntity<?> updatePassword(@AuthenticationPrincipal User currentUser, @RequestBody UpdatePasswordRequest updatePasswordRequest) {
        User updated = service.updatePassword(currentUser.getId(), updatePasswordRequest.getCurrentPassword(), updatePasswordRequest.getNewPassword());
        if (updated != null) {
            return ResponseEntity.ok(
                    Map.of("status", 200, "message", "Password updated successfully", "user", updated)
            );
        } else {
            return ResponseEntity.ok(
                    Map.of("status", 400, "message", "Failed to update password")
            );
        }
    }
}
