package isa.service;

import isa.model.*;
import isa.repository.RankRepository;
import isa.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RankRepository rankRepository;

    public User getUserById(Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        return optionalUser.orElse(null); // Return null if user not found
    }
    public User getUserByIdOrEmail(String idOrEmail) {
        try {
            Long userId = Long.parseLong(idOrEmail);
            return userRepository.findById(userId).orElse(null);
        } catch (NumberFormatException e) {
            return userRepository.findByEmail(idOrEmail).orElse(null);
        }
    }

    public User updateUser(Long userId, User updatedUser) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            // Update the user properties with the data from updatedUser
            user.setFirstname(updatedUser.getFirstname());
            user.setLastname(updatedUser.getLastname());
            user.setCity(updatedUser.getCity());
            user.setCountry(updatedUser.getCountry());
            user.setPhone(updatedUser.getPhone());
            user.setLoyaltyPoints(updatedUser.getLoyaltyPoints());
            user.setPenaltyPoints(updatedUser.getPenaltyPoints());
            user.setOccupation(updatedUser.getOccupation());
            user.setOrganization(updatedUser.getOrganization());

            // Save the updated user back to the database
            return userRepository.save(user);
        } else {
            return null; // Return null if user not found
        }
    }

    public User updatePassword(Long userId, String currentPassword, String newPassword) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (passwordEncoder.matches(currentPassword, user.getPassword())) {
                // If the current password matches, update the password with the new one
                user.setPassword(passwordEncoder.encode(newPassword));
                // Save the updated user back to the database
                return userRepository.save(user);
            } else {
                throw new IllegalArgumentException("Current password is incorrect.");
            }
        } else {
            throw new IllegalArgumentException("User not found.");
        }
    }

    public ResponseEntity<?> getUserRank(Long userId) {
        try {
            User user = getUserById(userId);
            if (user == null) {
                throw new IllegalArgumentException("User not found.");
            }

            int points = user.getLoyaltyPoints();
            List<Rank> ranks = rankRepository.findAllByThresholdGreaterThanEqual(0); // Fetch ranks with positive thresholds

            // Find the highest threshold among normal ranks
            int highestThreshold = ranks.get(ranks.size() - 1).getThreshold();

            // Iterate through ranks and return the first rank with a threshold greater than user points
            for (Rank rank : ranks) {
                if (points <= rank.getThreshold()) {
                    return ResponseEntity.ok(rank);
                }
            }

            // If user points exceed all normal thresholds, return the rank with threshold -1
            return ResponseEntity.ok(rankRepository.findByThreshold(-1));
        } catch (Exception e){
            return  ResponseEntity.badRequest().body("Transcendent rank not found.");
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

            int highestThreshold = ranks.get(ranks.size() - 1).getThreshold();

            for (Rank rank : ranks) {
                if (points <= rank.getThreshold()) {
                    return Optional.of(rank);
                }
            }

            return rankRepository.findByThreshold(-1);
        } catch (Exception e){
            throw new RuntimeException("Transcendent rank not found.");
        }
    }


    public User saveUser(User user) {
        return userRepository.save(user);
    }
    public User modifyUser(User user) {
        // Check if the user exists in the database
        User existingUser = userRepository.findById(user.getId()).orElse(null);

        if (existingUser == null) {
            // User does not exist, throw an exception or handle accordingly
            throw new IllegalArgumentException("User not found.");
        }

        // Update the data for the existing user
        existingUser.setEmail(user.getEmail());
        existingUser.setFirstname(user.getFirstname());
        existingUser.setLastname(user.getLastname());
        existingUser.setCity(user.getCity());
        existingUser.setCountry(user.getCountry());
        existingUser.setPhone(user.getPhone());
        existingUser.setOccupation(user.getOccupation());
        existingUser.setOrganization(user.getOrganization());
        existingUser.setLoyaltyPoints(user.getLoyaltyPoints());
        existingUser.setPenaltyPoints(user.getPenaltyPoints());
        existingUser.setRole(user.getRole());
        return userRepository.save(existingUser);
    }
}
