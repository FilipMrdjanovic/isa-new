package isa.security.config;

import isa.model.Company;
import isa.model.Rank;
import isa.model.Role;
import isa.model.User;
import isa.repository.CompanyRepository;
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
    private final RankRepository rankRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedRanks();
        seedCompanies();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            List<User> defaultUsers = Arrays.asList(
                    createDefaultUser("xxmrkixx@gmail.com", Role.USER, "John", "Doe", "New York", "USA", "1234567890", "Engineer", "Company A", 0, 0)
            );
            userRepository.saveAll(defaultUsers);
        }
    }

    private void seedRanks() {
        List<Rank> ranks = Arrays.asList(
                new Rank(1L, 0, "Bronze", "#cd7f32"),
                new Rank(2L, 40, "Silver", "#c0c0c0"),
                new Rank(3L, 80, "Gold", "#ffd700"),
                new Rank(4L, 180, "Diamond", "#0ebfe9"),
                new Rank(5L, -1, "Transcendent", "rainbow")
        );
        rankRepository.saveAll(ranks);
    }

    private void seedCompanies() {
        if (companyRepository.count() == 0) {
            List<Company> defaultCompanies = Arrays.asList(
                    createDefaultCompanies("MediGear Solutions","Bulevar Oslobođenja 5", "Novi Sad",6.5),
                    createDefaultCompanies("VitaTech Innovations","Futoška 12", "Novi Sad",8.2),
                    createDefaultCompanies("MediServe Dynamics","Maksima Gorkog 12", "Novi Sad",4.7),
                    createDefaultCompanies("MedEquip Pro","Bulevar cara Lazara 9", "Novi Sad",9.1),
                    createDefaultCompanies("HealthTech Solutions","Braće Ribnikar 5", "Novi Sad",2.4),
                    createDefaultCompanies("Apex Medical Supplies","Bulevar oslobođenja 66", "Novi Sad",7.8),
                    createDefaultCompanies("MedCore Innovations","Jovana Subotića 2", "Novi Sad",5.3),
                    createDefaultCompanies("MedixTech Enterprises","Petra Drapšina 7", "Novi Sad",3.6),
                    createDefaultCompanies("EquipMed Solutions","Fruškogorska 4", "Novi Sad",6.9),
                    createDefaultCompanies("MedSource Innovate","Somborska 13", "Novi Sad",8.4),
                    createDefaultCompanies("MedTech Hub","Cara Dušana 22", "Novi Sad",4.2),
                    createDefaultCompanies("MedVantage Pro","Vojvode Stepe 18", "Novi Sad",9.7),
                    createDefaultCompanies("EquipCare Solutions","Zmaj Jovina 10", "Novi Sad",7.1),
                    createDefaultCompanies("LifeMed Devices","Bulevar despota Stefana 14", "Novi Sad",5.8),
                    createDefaultCompanies("MedTech Prodigy","Nikole Pašića 3", "Novi Sad",3.9),
                    createDefaultCompanies("WellCare Innovations","Cara Lazara 39", "Novi Sad",8.0),
                    createDefaultCompanies("AccuMed Tech","Kralja Petra I 8", "Novi Sad",6.6),
                    createDefaultCompanies("MedInnoVest Solutions","Bulevar oslobođenja 52", "Novi Sad",2.7),
                    createDefaultCompanies("CureAll Enterprises","Njegoševa 7", "Novi Sad",9.5),
                    createDefaultCompanies("MedEase Dynamics","Ilije Ognjanovića 17", "Novi Sad",7.3)

            );
            companyRepository.saveAll(defaultCompanies);
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

    private Company createDefaultCompanies(String name, String address, String city,Double averageRating){
        Company company = new Company(name, address, city, averageRating);
        return company;
    }
}
