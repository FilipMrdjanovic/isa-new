package isa.security.config;

import isa.model.*;
import isa.repository.*;
import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Component
@AllArgsConstructor
public class DataSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final RankRepository rankRepository;
    private final CompanyRepository companyRepository;
    private final EquipmentRepository equipmentRepository;
    private final EquipmentSetRepository equipmentSetRepository;
    private final EquipmentTransactionRepository equipmentTransactionRepository;
    private final PickupScheduleRepository pickupScheduleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedUsersAndCompanies();
        seedRanks();
        seedEquipment();
        seedEquipmentSets();
//        seedPickupSchedule();
//        seedUserPickupSchedule();
    }

    private void seedUsersAndCompanies() {
        List<String> companyNames = new ArrayList<>(Arrays.asList(
                "MediGear Solutions",
                "VitaTech Innovations",
                "MediServe Dynamics",
                "MedEquip Pro",
                "HealthTech Solutions",
                "Apex Supplies",
                "MedCore Innovations",
                "MedixTech Enterprises",
                "EquipMed Solutions",
                "MedSource Innovate",
                "MedTech Hub",
                "MedVantage Pro",
                "EquipCare Solutions"
        ));
        List<String> addressNames = new ArrayList<>(Arrays.asList(
                "Bulevar Oslobođenja 5",
                "Futoška 12",
                "Maksima Gorkog 12",
                "Bulevar cara Lazara 9",
                "Braće Ribnikar 5",
                "Bulevar oslobođenja 66",
                "Jovana Subotića 2",
                "Petra Drapšina 7",
                "Fruškogorska 4",
                "Somborska 13",
                "Cara Dušana 22",
                "Vojvode Stepe 18",
                "Zmaj Jovina 10"
        ));
        List<String> cityNames = new ArrayList<>(Arrays.asList(
                "Beograd",
                "Niš",
                "Kragujevac",
                "Subotica",
                "Čačak",
                "Novi Sad"
        ));
        if (userRepository.count() == 0) {
            List<User> defaultUsers = Arrays.asList(
                    createDefaultUser("user@user.com", Role.USER, "John", "Doe", "Los Angeles", "USA", "9876543210", "Engineer", "Tech Corp", 1, 1),
                    createDefaultUser("alice@email.com", Role.USER, "Alice", "Johnson", "New York", "USA", "1234567890", "Software Developer", "Tech Solutions Inc", 0, 50),
                    createDefaultUser("bob@email.com", Role.USER, "Bob", "Smith", "San Francisco", "USA", "9876543210", "Data Analyst", "Data Corp", 2, 30),
                    createDefaultUser("carol@email.com", Role.USER, "Carol", "Williams", "Chicago", "USA", "5554443333", "Marketing Manager", "Marketing Agency", 1, 70),
                    createDefaultUser("david@email.com", Role.USER, "David", "Brown", "Houston", "USA", "2223334444", "Financial Analyst", "Finance Co.", 3, 20),
                    createDefaultUser("emily@email.com", Role.USER, "Emily", "Davis", "Miami", "USA", "7778889999", "Graphic Designer", "Design Studio", 0, 40),
                    createDefaultUser("frank@email.com", Role.USER, "Frank", "Wilson", "Seattle", "USA", "6665554444", "Product Manager", "Product Inc.", 2, 60),
                    createDefaultUser("grace@email.com", Role.USER, "Grace", "Martinez", "Dallas", "USA", "1112223333", "HR Manager", "HR Solutions", 1, 10),
                    createDefaultUser("hannah@email.com", Role.USER, "Hannah", "Anderson", "Phoenix", "USA", "9990001111", "Sales Representative", "Sales Company", 4, 80),
                    createDefaultUser("ian@email.com", Role.USER, "Ian", "Thompson", "Boston", "USA", "8889990000", "Software Engineer", "Tech Innovations", 0, 25),
                    createDefaultUser("jessica@email.com", Role.USER, "Jessica", "Garcia", "Austin", "USA", "4445556666", "UX/UI Designer", "UX Design Co.", 2, 45),

                    createDefaultUser("admin@admin.com", Role.SYSTEM_ADMIN, "Eva", "Brown", "Tokyo", "USA", "7654321098", "Manager", "Innovate Tech", 3, 3),

                    createDefaultUser("company@company.com", Role.COMPANY_ADMIN, "Bob", "Smith", "Paris", "USA", "8765432109", "Developer", "Tech Innovations", 2, 2),
                    createDefaultUser("company1@company.com", Role.COMPANY_ADMIN, "Alice", "Johnson", "New York", "USA", "1234567890", "Engineer", "Tech Corp", 0, 100),
                    createDefaultUser("ceo@company.com", Role.COMPANY_ADMIN, "David", "Lee", "San Francisco", "USA", "9876543210", "CEO", "Innovate Inc", 5, 500),
                    createDefaultUser("company2@company.com", Role.COMPANY_ADMIN, "Emma", "Garcia", "Los Angeles", "USA", "5556667777", "Manager", "Digital Co", 3, 250),
                    createDefaultUser("head@company.com", Role.COMPANY_ADMIN, "Sophia", "Nguyen", "Chicago", "USA", "1112223333", "Head of Operations", "Solutions Ltd", 1, 75),
                    createDefaultUser("company3@company.com", Role.COMPANY_ADMIN, "Ethan", "Williams", "Austin", "USA", "4445556666", "Analyst", "Data Solutions", 0, 200),
                    createDefaultUser("manager@company.com", Role.COMPANY_ADMIN, "Olivia", "Brown", "Seattle", "USA", "7778889999", "Project Manager", "Tech Innovations", 2, 150),
                    createDefaultUser("company4@company.com", Role.COMPANY_ADMIN, "James", "Rodriguez", "Miami", "USA", "1011121314", "Consultant", "Future Enterprises", 4, 300),
                    createDefaultUser("director@company.com", Role.COMPANY_ADMIN, "Ava", "Martinez", "Boston", "USA", "1213141516", "Director", "Advanced Solutions", 6, 400),
                    createDefaultUser("company5@company.com", Role.COMPANY_ADMIN, "Mason", "Gomez", "Denver", "USA", "1718192021", "Software Developer", "Tech Wizards", 0, 80),
                    createDefaultUser("lead@company.com", Role.COMPANY_ADMIN, "Harper", "Ng", "Portland", "USA", "2223334444", "Lead Engineer", "Innovate Tech", 2, 120)
            );
            userRepository.saveAll(defaultUsers);

            for (User user : defaultUsers) {
                if (user.getRole().equals(Role.COMPANY_ADMIN)) {

                    String randomCompanyName = getRandomAndRemove(companyNames);
                    String randomAddress = getRandomAndRemove(addressNames);
                    String randomCity = cityNames.get(new Random().nextInt(cityNames.size()));

                    Company company = new Company();
                    company.setName(randomCompanyName);
                    company.setAddress(randomAddress);
                    company.setCity(randomCity);
                    Double randomRating = Math.round((new Random().nextDouble() * 10) * 10.0) / 10.0;
                    company.setAverageRating(randomRating);
                    company.setTimeOfOpening(LocalTime.of(8, 0));
                    company.setTimeOfClosing(LocalTime.of(20, 0));
                    company.setMinDuration(15);
                    company.setMaxDuration(180);
                    companyRepository.save(company);
                    user.setCompany(company);
                    userRepository.save(user);
                }
            }
        }
    }

    private void seedPickupSchedule() {
        List<Company> companies = companyRepository.findAll();
        Random random = new Random();
        for (Company company : companies) {
            Optional<User> user = userRepository.findByCompanyId(company.getId());
            if (user.isPresent()) {
                LocalDate today = LocalDate.now();
                for (int day = -2; day <= 2; day++) {
                    LocalDate date = today.plusDays(day);
                    createMultiplePickupSchedules(company, user.get(), date, random);
                }
            }
        }
    }

    private void seedUserPickupSchedule() {
        LocalDate date = LocalDate.now().plusDays(5);
        List<User> users = userRepository.findFirst5ByRole(Role.USER);
        for (User u : users) {
            Long maxCenterId = companyRepository.findTopByOrderByIdDesc().map(Company::getId).orElse(0L);
            Long randId = (long) (Math.random() * maxCenterId + 1); // Generate a random ID within the range
            Random userRandom = new Random(); // Instantiate a new Random instance here
            createPickupScheduleForUser(Optional.ofNullable(u), date, userRandom, companyRepository.findRandomCompany(randId).get());
        }
    }

    private void createMultiplePickupSchedules(Company company, User companyAdmin, LocalDate date, Random random) {
        LocalTime startTime = LocalTime.of(8, 0); // Set the starting time to 8 AM
        int numberOfPickupSchedules = 5; // Number of appointments to create for each day

        for (int i = 0; i < numberOfPickupSchedules; i++) {
            int maxAttempts = 5; // Maximum attempts to find a non-overlapping time
            int attempts = 0;
            boolean overlapFound = true;
            LocalTime randomTime = null;

            int duration = 0;
            while (overlapFound && attempts < maxAttempts) {
                // Create a random time within the working hours of the center
                randomTime = startTime.plusMinutes(random.nextInt(getWorkingMinutes(company)));

                // Create a random duration between 15 and 25 minutes
                duration = 15 + random.nextInt(11);

                // Check for overlaps with existing appointments
                overlapFound = isOverlap(company, date, randomTime, duration);

                attempts++;
            }

            if (!overlapFound && randomTime != null) {
                createPickupSchedule(company, companyAdmin, date, randomTime, duration);
            }
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

                    EquipmentSet equipmentSet = new EquipmentSet(quantity, randomEquipment, company);
                    equipmentSets.add(equipmentSet);
                }
                equipmentSetRepository.saveAll(equipmentSets);
            }
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

    private String getRandomAndRemove(List<String> list) {
        int randomIndex = new Random().nextInt(list.size());
        String randomElement = list.get(randomIndex);
        list.remove(randomIndex);
        return randomElement;
    }

    private boolean isOverlap(Company company, LocalDate date, LocalTime newTime, int newDuration) {
        LocalDateTime newStartTime = LocalDateTime.of(date, newTime);
        LocalDateTime newEndTime = newStartTime.plusMinutes(newDuration);

        List<PickupSchedule> existingSchedules =
                pickupScheduleRepository.findAllByCompanyIdAndDate(
                        company.getId(),
                        date.getYear(),
                        date.getMonthValue(),
                        date.getDayOfMonth()
                );

        for (PickupSchedule pickupSchedule : existingSchedules) {
            LocalDateTime existingStartTime = LocalDateTime.of(pickupSchedule.getDate(), pickupSchedule.getTime());
            LocalDateTime existingEndTime = existingStartTime.plusMinutes(pickupSchedule.getDuration());

            if (newStartTime.isBefore(existingEndTime) && newEndTime.isAfter(existingStartTime)) {
                return true; // Overlap detected
            }
        }

        return false; // No overlap found
    }

    private void createPickupSchedule(Company company, User companyAdmin, LocalDate date, LocalTime time, int duration) {
        PickupSchedule pickupSchedule = new PickupSchedule();
        pickupSchedule.setDate(date);
        pickupSchedule.setTime(time);
        pickupSchedule.setDuration(duration);
        pickupSchedule.setPickupScheduleType(PickupScheduleType.PREDEFINED);
        pickupSchedule.setReserved(false);
        pickupSchedule.setActive(false);

        // Check if the date is in the past
        if (date.isBefore(LocalDate.now())) {
            pickupSchedule.setCompleted(true);
        } else {
            pickupSchedule.setCompleted(false);
        }

        pickupSchedule.setCompany(company);
        pickupSchedule.setCompanyAdmin(companyAdmin);
        pickupScheduleRepository.save(pickupSchedule);

        Random r = new Random();
        int temp = r.nextInt(100);

        // Only proceed if the temp value is less than 15
        if (temp < 15) {
            List<User> unassignedUsers = userRepository.findAllByRole(Role.USER);

            // Filter out users that already have a transaction
            List<User> usersWithConnections = equipmentTransactionRepository.findAll().stream()
                    .map(EquipmentTransaction::getUser)
                    .collect(Collectors.toList());

            unassignedUsers.removeAll(usersWithConnections);

            if (!unassignedUsers.isEmpty()) {
                Optional<EquipmentSet> equipmentSet = equipmentSetRepository.findFirstAvailableByCompanyId(company.getId());
                if (equipmentSet.isPresent()) {
                    EquipmentSet eqSet = equipmentSet.get();
                    User user = unassignedUsers.get(r.nextInt(unassignedUsers.size()));
                    EquipmentTransaction transaction = new EquipmentTransaction();
                    transaction.setUser(user);
                    transaction.setPickupSchedule(pickupSchedule);
                    transaction.setEquipmentSet(eqSet);
                    equipmentTransactionRepository.save(transaction);

                    eqSet.setAvailable(false);
                    equipmentSetRepository.save(eqSet);
                }
            }
        }
    }

    private void createPickupScheduleForUser(Optional<User> user, LocalDate date, Random random, Company company) {
        LocalTime startTime = company.getTimeOfOpening();
        int workingMinutes = getWorkingMinutes(company);
        LocalTime randomTime = startTime.plusMinutes(random.nextInt(workingMinutes));

        int duration = 15 + random.nextInt(11);

        if (user.isPresent()) {
            List<User> companyAdmins = userRepository.findAllByRole(Role.COMPANY_ADMIN);
            User companyAdmin = companyAdmins.get(new Random().nextInt(companyAdmins.size()));

            User _user = user.get();
            PickupSchedule pickupSchedule = new PickupSchedule();
            pickupSchedule.setDate(date);
            pickupSchedule.setTime(randomTime);
            pickupSchedule.setDuration(duration);
            pickupSchedule.setPickupScheduleType(PickupScheduleType.USERDEFINED);
            pickupSchedule.setReserved(true);
            pickupSchedule.setActive(false);
            pickupSchedule.setCompleted(true);
            pickupSchedule.setCompany(company);
            pickupSchedule.setCompanyAdmin(companyAdmin);
            pickupScheduleRepository.save(pickupSchedule);

            Optional<EquipmentSet> equipmentSet = equipmentSetRepository.findFirstAvailableByCompanyId(company.getId());
            if (equipmentSet.isPresent()) {

                EquipmentSet eqSet = equipmentSet.get();
                // Create the transaction between the user and the pickup schedule
                EquipmentTransaction transaction = new EquipmentTransaction();
                transaction.setUser(_user);
                transaction.setPickupSchedule(pickupSchedule);
                transaction.setEquipmentSet(eqSet);

                equipmentTransactionRepository.save(transaction);
            }
        }
    }

    private int getWorkingMinutes(Company company) {
        Duration duration = Duration.between(company.getTimeOfOpening(), company.getTimeOfClosing());
        return (int) duration.toMinutes();
    }
}
