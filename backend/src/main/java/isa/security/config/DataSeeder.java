package isa.security.config;

import isa.model.*;
import isa.repository.*;
import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
@AllArgsConstructor
public class DataSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final RankRepository rankRepository;
    private final CompanyRepository companyRepository;
    private final EquipmentRepository equipmentRepository;
    private final EquipmentSetRepository equipmentSetRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedRanks();
        seedCompanies();
        seedEquipment();
        seedEquipmentSets();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            List<User> defaultUsers = Arrays.asList(
                    createDefaultUser("user@user.com", Role.USER, "John", "Doe", "Los Angeles", "USA", "9876543210", "Engineer", "Company B", 1, 1),
            createDefaultUser("company@company.com", Role.COMPANY_ADMIN, "Bob", "Smith", "Paris", "USA", "8765432109", "Developer", "Company C", 2, 2),
            createDefaultUser("admin@admin.com", Role.SYSTEM_ADMIN, "Eva", "Brown", "Tokyo", "USA", "7654321098", "Manager", "Company D", 3, 3)

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

    private void seedEquipment() {
        if (equipmentRepository.count() == 0) {
            List<Equipment> equipmentList = Arrays.asList(
                    new Equipment("Surgical Tools", "Basic tools for surgery"),
                    new Equipment("MRI Machine", "Magnetic Resonance Imaging"),
                    new Equipment("Ultrasound Scanner", "Diagnostic imaging"),
                    new Equipment("X-Ray Machine", "Radiographic examination"),
                    new Equipment("Anesthesia Machine", "For administering anesthesia"),
                    new Equipment("Defibrillator", "For life-threatening cardiac conditions"),
                    new Equipment("ECG Machine", "Measures electrical activity of the heart"),
                    new Equipment("Ventilator", "Assists with breathing"),
                    new Equipment("Infusion Pump", "Delivers fluids/medication into a patient's body"),
                    new Equipment("Blood Analyzer", "Analyzes blood samples for diagnosis")
                    // Add more diverse Equipment data here
            );
            equipmentRepository.saveAll(equipmentList);
        }
    }

    private void seedEquipmentSets() {
        if (equipmentSetRepository.count() == 0) {
            List<Equipment> allEquipment = equipmentRepository.findAll();
            List<Company> allCompanies = companyRepository.findAll();

            Random random = new Random();

            for (Company company : allCompanies) {
                List<EquipmentSet> equipmentSets = new ArrayList<>();
                for (int i = 0; i < 5; i++) {
                    Equipment randomEquipment = allEquipment.get(random.nextInt(allEquipment.size()));
                    int quantity = random.nextInt(10) + 1; // Random quantity from 1 to 10

                    EquipmentSet equipmentSet = new EquipmentSet(null, quantity, randomEquipment, company);
                    equipmentSets.add(equipmentSet);
                }
                equipmentSetRepository.saveAll(equipmentSets);
            }
        }
    }
}
