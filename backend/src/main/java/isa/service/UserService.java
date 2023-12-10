package isa.service;

import isa.model.Rank;
import isa.model.User;
import isa.payload.request.UpdateForm;
import isa.repository.RankRepository;
import isa.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RankRepository rankRepository;

    public User getUserById(Long userId) {
        return userRepository.findById(userId).orElse(null);
    }

    public User getUserByIdOrEmail(String idOrEmail) {
        try {
            Long userId = Long.parseLong(idOrEmail);
            return userRepository.findById(userId).orElse(null);
        } catch (NumberFormatException e) {
            return userRepository.findByEmail(idOrEmail).orElse(null);
        }
    }

    public User updateUser(Long userId, UpdateForm updateForm) {
        return userRepository.findById(userId)
                .map(user -> {
                    user.updateForm(updateForm);
                    return userRepository.save(user);
                })
                .orElse(null);
    }

    public User updatePassword(Long userId, String currentPassword, String newPassword) {
        return userRepository.findById(userId)
                .map(user -> {
                    if (passwordEncoder.matches(currentPassword, user.getPassword())) {
                        user.setPassword(passwordEncoder.encode(newPassword));
                        return userRepository.save(user);
                    } else {
                        throw new IllegalArgumentException("Current password is incorrect.");
                    }
                })
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
    }

    public ResponseEntity<?> getUserRank(Long userId) {
        try {
            User user = getUserById(userId);

            int points = user.getLoyaltyPoints();
            List<Rank> ranks = rankRepository.findAllByThresholdGreaterThanEqual(0);

            return ranks.stream()
                    .filter(rank -> points <= rank.getThreshold())
                    .findFirst()
                    .map(rank -> ResponseEntity.ok(
                            Map.of("status", 200, "message", "User rank retrieved successfully", "userRank", rank))
                    )
                    .orElseGet(() -> ResponseEntity.ok(
                            Map.of("status", 404, "message", "User rank not found"))
                    );


        } catch (Exception e) {
            return ResponseEntity.ok(
                    Map.of("status", 404, "message", "Rank not found")
            );
        }
    }

    public Optional<Rank> getUserRankAndType(Long userId) {
        try {
            User user = getUserById(userId);
            if (user == null) {
                throw new IllegalArgumentException("User not found.");
            }

            int points = user.getLoyaltyPoints();
            List<Rank> ranks = rankRepository.findAllByThresholdGreaterThanEqual(0);

            return ranks.stream()
                    .filter(rank -> points <= rank.getThreshold())
                    .findFirst()
                    .or(() -> rankRepository.findByThreshold(-1));

        } catch (Exception e) {
            throw new RuntimeException("Transcendent rank not found.");
        }
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public User modifyUser(UpdateForm userForm, Long userId) {
        return userRepository.findById(userId)
                .map(existingUser -> {
                    existingUser.updateForm(userForm);
                    return userRepository.save(existingUser);
                })
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
    }
}
