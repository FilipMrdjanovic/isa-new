package isa.controller;

import isa.model.Rank;
import isa.model.User;
import isa.payload.request.UpdateForm;
import isa.repository.RankRepository;
import isa.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/search")
    public ResponseEntity<User> getUserByIdOrEmail(@RequestParam String idOrEmail) {
        User user = userService.getUserByIdOrEmail(idOrEmail);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable Long userId, @RequestBody UpdateForm updateForm) {
        User updatedUser = userService.updateUser(userId, updateForm);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/{userId}/password")
    public ResponseEntity<User> updatePassword(@PathVariable Long userId,
                                               @RequestParam String currentPassword,
                                               @RequestParam String newPassword) {
        User updatedUser = userService.updatePassword(userId, currentPassword, newPassword);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/{userId}/rank")
    public ResponseEntity<?> getUserRank(@PathVariable Long userId) {
        return userService.getUserRank(userId);
    }

    @GetMapping("/{userId}/rank-type")
    public ResponseEntity<Optional<Rank>> getUserRankAndType(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserRankAndType(userId));
    }

    @PostMapping
    public ResponseEntity<User> saveUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.saveUser(user));
    }

    @PatchMapping("/{userId}")
    public ResponseEntity<User> modifyUser(@PathVariable Long userId, @RequestBody UpdateForm updateForm) {
        User modifiedUser = userService.modifyUser(updateForm, userId);
        return ResponseEntity.ok(modifiedUser);
    }
}
