package isa.security.config;

import isa.model.Rank;
import isa.model.Role;
import isa.model.User;
import isa.repository.RankRepository;
import isa.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@AllArgsConstructor
public class DataSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RankRepository rankRepository;

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedRanks();
    }


    private void seedUsers() {
        if (userRepository.count() == 0) {
            List<User> defaultUsers = Arrays.asList(
                    createDefaultUser("xxmrkixx@gmail.com", Role.USER, "John", "Doe", "New York", "USA", "1234567890", "Engineer", "Company A", 0, 0)
            );
            userRepository.saveAll(defaultUsers);
        }
    }

    private User createDefaultUser(
            String email, Role role, String firstname, String lastname,
            String city, String country, String phone, String occupation,
            String organization, int penaltyPoints, int loyaltyPoints) {
        User user = new User();
        user.setEmail(email);
        user.setRole(role);
        user.setFirstname(firstname);
        user.setLastname(lastname);
        user.setCity(city);
        user.setCountry(country);
        user.setPhone(phone);
        user.setOccupation(occupation);
        user.setOrganization(organization);
        user.setPenaltyPoints(penaltyPoints);
        user.setLoyaltyPoints(loyaltyPoints);
        user.setPassword(passwordEncoder.encode("123456789"));
        user.setEnabled(true);
        return user;
    }

    private void seedRanks() {
        List <Rank> ranks = Arrays.asList(
                new Rank(1L, 0, "Bronze", "#cd7f32"),
                new Rank(2L, 40, "Silver", "#c0c0c0"),
                new Rank(3L, 80, "Gold", "#ffd700"),
                new Rank(4L, 180, "Diamond", "#0ebfe9"),
                new Rank(5L, -1, "Transcendent", "rainbow")
        );
        rankRepository.saveAll(ranks);

    }

}
