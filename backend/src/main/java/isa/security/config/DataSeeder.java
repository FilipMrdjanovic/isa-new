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
                    createDefaultCompanies("MediGear Solutions","Bulevar Oslobođenja 5", "Belgrade", 7.0),
                    createDefaultCompanies("VitaTech Innovations","Futoška 12", "Novi Sad", 8.0),
                    createDefaultCompanies("MediServe Dynamics","Maksima Gorkog 12", "Niš", 5.0),
                    createDefaultCompanies("MedEquip Pro","Bulevar cara Lazara 9", "Kragujevac", 9.0),
                    createDefaultCompanies("HealthTech Solutions","Braće Ribnikar 5", "Subotica", 2.0),
                    createDefaultCompanies("Apex Medical Supplies","Bulevar oslobođenja 66", "Čačak", 8.0),
                    createDefaultCompanies("MedCore Innovations","Jovana Subotića 2", "Belgrade", 5.0),
                    createDefaultCompanies("MedixTech Enterprises","Petra Drapšina 7", "Kragujevac", 4.0),
                    createDefaultCompanies("EquipMed Solutions","Fruškogorska 4", "Novi Sad", 7.0),
                    createDefaultCompanies("MedSource Innovate","Somborska 13", "Niš", 8.0),
                    createDefaultCompanies("MedTech Hub","Cara Dušana 22", "Subotica", 4.0),
                    createDefaultCompanies("MedVantage Pro","Vojvode Stepe 18", "Belgrade", 10.0),
                    createDefaultCompanies("EquipCare Solutions","Zmaj Jovina 10", "Novi Sad", 7.0),
                    createDefaultCompanies("LifeMed Devices","Bulevar despota Stefana 14", "Niš", 6.0),
                    createDefaultCompanies("MedTech Prodigy","Nikole Pašića 3", "Subotica", 4.0),
                    createDefaultCompanies("WellCare Innovations","Cara Lazara 39", "Belgrade", 8.0),
                    createDefaultCompanies("AccuMed Tech","Kralja Petra I 8", "Novi Sad", 7.0),
                    createDefaultCompanies("MedInnoVest Solutions","Bulevar oslobođenja 52", "Niš", 3.0),
                    createDefaultCompanies("CureAll Enterprises","Njegoševa 7", "Subotica", 10.0),
                    createDefaultCompanies("MedEase Dynamics","Ilije Ognjanovića 17", "Belgrade", 7.0)


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
