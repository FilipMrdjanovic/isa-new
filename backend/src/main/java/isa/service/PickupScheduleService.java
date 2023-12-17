package isa.service;

import isa.model.*;
import isa.payload.request.PickupScheduleRequest;
import isa.payload.request.UserPickupScheduleRequest;
import isa.payload.response.TimeSlotResponse;
import isa.payload.response.UserPickupScheduleResponse;
import isa.repository.CompanyRepository;
import isa.repository.EquipmentSetRepository;
import isa.repository.EquipmentTransactionRepository;
import isa.repository.PickupScheduleRepository;
import isa.service.mailing.EmailSender;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class PickupScheduleService {

    private final PickupScheduleRepository pickupScheduleRepository;
    private final CompanyRepository companyRepository;
    private final EquipmentSetRepository equipmentSetRepository;
    private final EquipmentTransactionRepository equipmentTransactionRepository;
    private final UserService userService;
    private final EmailSender emailSender;
    @PersistenceContext
    private EntityManager entityManager;


    //    for company users
    public ResponseEntity<?> createPickupSchedule(PickupScheduleRequest request, User user) {
        try {
            Company company = user.getCompany();
            if (company == null) {
                return ResponseEntity.ok(
                        Map.of("status", 400, "message", "User is not in relation with any company"));
            }

            validatePickupScheduleRequest(request, company);

            LocalDate date = request.getDate();
            LocalTime time = request.getTime();
            int duration = request.getDuration();

            if (!findOverlappingPickupSchedules(user.getCompany().getId(), date, time, duration).isEmpty()) {
                return ResponseEntity.ok(
                        Map.of("status", 400, "message", "Pickup schedule is overlapping with existing schedule"));
            }

            PickupSchedule pickupSchedule = PickupSchedule.builder()
                    .date(date)
                    .time(time)
                    .duration(duration)
                    .pickupScheduleType(PickupScheduleType.PREDEFINED)
                    .reserved(false)
                    .completed(false)
                    .active(false)
                    .company(company)
                    .companyAdmin(user)
                    .build();

            pickupScheduleRepository.save(pickupSchedule);
            return ResponseEntity.ok(
                    Map.of("status", 200, "message", "Planning schedule successful"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.ok(
                    Map.of("status", 400, "message", e.getMessage()));
        }
    }

    public ResponseEntity<?> createUserDefinedPickupSchedule(UserPickupScheduleRequest request, User user) {
        try {
            Optional<EquipmentSet> equipmentSet = equipmentSetRepository.findById(request.getEquipmentSetId());
            if (!equipmentSet.isPresent()) {
                return ResponseEntity.ok(
                        Map.of("status", 404, "message", "Equipment set not found"));
            }

            Optional<Company> company = companyRepository.findById(request.getId());
            if (!company.isPresent()) {
                return ResponseEntity.ok(
                        Map.of("status", 404, "message", "Company not found"));
            }

            LocalDate date = request.getDate();
            LocalTime time = request.getTime();
            int duration = 15; // Set the duration to 15 minutes

            // Check for overlapping schedules
            List<PickupSchedule> overlappingPickupSchedules = findOverlappingPickupSchedules(request.getId(), date, time, duration);

            if (!overlappingPickupSchedules.isEmpty()) {
                return ResponseEntity.ok(
                        Map.of("status", 400, "message", "Pickup schedule is overlapping with existing schedule"));
            }

            PickupSchedule pickupSchedule = PickupSchedule.builder()
                    .date(date)
                    .time(time)
                    .duration(duration)
                    .reserved(true)
                    .completed(false)
                    .active(false)
                    .pickupScheduleType(PickupScheduleType.USERDEFINED)
                    .company(company.get())
                    .companyAdmin(userService.getCompanyAdmin())
                    .build();

            PickupSchedule savedPickupSchedule = pickupScheduleRepository.save(pickupSchedule);

            EquipmentTransaction transaction = new EquipmentTransaction();
            transaction.setUser(user);
            transaction.setPickupSchedule(savedPickupSchedule);
            transaction.setEquipmentSet(equipmentSet.get());
            equipmentTransactionRepository.save(transaction);


            pickupSchedule.setEquipmentTransactions(equipmentTransactionRepository.findByUser(user));
            pickupScheduleRepository.save(pickupSchedule);

            // Send the QR code email to the user
            try {
                sendQrCodeConfirmation(user, transaction);
            } catch (Exception e) {
                return ResponseEntity.ok(
                        Map.of("status", 500, "message", "Error while sending email: " + e.getMessage()));
            }
            return ResponseEntity.ok(
                    Map.of("status", 200, "message", "Planning schedule successful"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.ok(
                    Map.of("status", 400, "message", e.getMessage()));
        }
    }

    public ResponseEntity<?> reserveSchedule(Long scheduleId, Long equipmentSetId, User currentUser) {
        try {
            Optional<EquipmentSet> equipmentSet = equipmentSetRepository.findById(equipmentSetId);
            if (!equipmentSet.isPresent()) {
                return ResponseEntity.ok(
                        Map.of("status", 404, "message", "Equipment set not found"));
            }

            Optional<PickupSchedule> pickupSchedule = pickupScheduleRepository.findById(scheduleId);
            if (!pickupSchedule.isPresent()) {
                return ResponseEntity.ok(
                        Map.of("status", 404, "message", "Schedule not found"));
            }

            PickupSchedule _pickupSchedule = pickupSchedule.get();
            _pickupSchedule.setReserved(true);
            pickupScheduleRepository.save(_pickupSchedule);

            EquipmentTransaction transaction = new EquipmentTransaction();
            transaction.setUser(currentUser);
            transaction.setPickupSchedule(_pickupSchedule);
            transaction.setEquipmentSet(equipmentSet.get());
            equipmentTransactionRepository.save(transaction);


            _pickupSchedule.setEquipmentTransactions(equipmentTransactionRepository.findByUser(currentUser));
            pickupScheduleRepository.save(_pickupSchedule);

            // Send the QR code email to the user
            try {
                sendQrCodeConfirmation(currentUser, transaction);
            } catch (Exception e) {
                return ResponseEntity.ok(
                        Map.of("status", 500, "message", "Error while sending email: " + e.getMessage()));
            }
            return ResponseEntity.ok(
                    Map.of("status", 200, "message", "Schedule successfully planned"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.ok(
                    Map.of("status", 400, "message", e.getMessage()));
        }
    }

    public ResponseEntity<?> getAvailableSchedulesForCompany(Long companyId) {
        try {
            LocalDate currentDate = LocalDate.now();
            LocalTime currentTime = LocalTime.now();

            // Fetch all pickup schedules for the given company that are not reserved and in the future
            List<PickupSchedule> pickupSchedules = pickupScheduleRepository.findAvailableSchedulesForCompany(companyId, currentDate, currentTime);

            if (pickupSchedules.isEmpty()) {
                return ResponseEntity.ok(
                        Map.of("status", 404, "message", "No available schedules found for the company"));
            }

            // Calculate free time slots from the available schedules
            List<TimeSlotResponse> freeTimeSlots = calculateUnusedTimeSlots(companyId, currentDate, pickupSchedules);

            return ResponseEntity.ok(
                    Map.of(
                            "status", 200,
                            "message", "Available schedules and free time slots found",
                            "pickupSchedules", pickupSchedules,
                            "freeTimeSlots", freeTimeSlots
                    ));
        } catch (Exception e) {
            return ResponseEntity.ok(
                    Map.of("status", 500, "message", "Error finding available schedules: " + e.getMessage()));
        }
    }

    private void sendQrCodeConfirmation(User user, EquipmentTransaction transaction) {
        emailSender.sendQrCode(user.getEmail(), user.getFirstname(), transaction);
    }

    public List<PickupSchedule> findOverlappingPickupSchedules(
            Long companyId,
            LocalDate date,
            LocalTime startTime,
            int durationInMinutes
    ) {
        List<PickupSchedule> overlappingPickupSchedules = new ArrayList<>();
        try {
            List<PickupSchedule> allPickupSchedules = pickupScheduleRepository.findByCompanyId(companyId);
            for (PickupSchedule pickupSchedule : allPickupSchedules) {
                if (pickupSchedule.getDate().equals(date)) {
                    LocalTime pickupStartTime = pickupSchedule.getTime();
                    LocalTime pickupEndTime = pickupStartTime.plusMinutes(durationInMinutes);

                    if (startTime.isBefore(pickupEndTime) && startTime.plusMinutes(durationInMinutes).isAfter(pickupStartTime)) {
                        overlappingPickupSchedules.add(pickupSchedule);
                    }
                }
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Overlapping error: " + e.getMessage());
        }

        return overlappingPickupSchedules;
    }

    private void validatePickupScheduleRequest(PickupScheduleRequest request, Company company) {
        // Check if the date is in the future
        LocalDate currentDate = LocalDate.now();
        if (request.getDate() == null || request.getDate().isBefore(currentDate)) {
            throw new IllegalArgumentException("Pickup date must be in the future.");
        }

        // Check if the time is valid
        LocalTime openingTime = company.getTimeOfOpening();
        LocalTime closingTime = company.getTimeOfClosing();
        LocalTime requestedTime = request.getTime();
        if (requestedTime != null && (requestedTime.isBefore(openingTime) || requestedTime.isAfter(closingTime))) {
            throw new IllegalArgumentException("Invalid pickup time. Company operates from "
                    + openingTime + " to " + closingTime + ".");
        }

        // Check if the duration is valid
        int minDurationInMinutes = company.getMinDuration();
        int maxDurationInMinutes = company.getMaxDuration();
        if (request.getDuration() < minDurationInMinutes || request.getDuration() > maxDurationInMinutes) {
            throw new IllegalArgumentException("Invalid duration. Duration must be between "
                    + minDurationInMinutes + " minutes and " + maxDurationInMinutes + " minutes.");
        }
    }

    public ResponseEntity<?> getDatesWithSchedulesForCompany(Long companyId, int year, int month) {
        try {
            List<String> dates = pickupScheduleRepository.findDatesWithPickupSchedulesForCompany(companyId, year, month);
            if (dates.isEmpty()) {
                return ResponseEntity.ok(
                        Map.of("status", 404, "message", "No dates are scheduled found for the provided year and month"));
            }
            return ResponseEntity.ok(
                    Map.of("status", 200, "message", "Dates found successfully", "dates", dates));
        } catch (Exception e) {
            return ResponseEntity.ok(
                    Map.of("status", 500, "message", "Error finding dates with schedule: " + e.getMessage()));
        }
    }

    public ResponseEntity<?> getUnusedTimeSlots(Long companyId, LocalDate date) {
        try {
            int year = date.getYear();
            int month = date.getMonthValue();
            int day = date.getDayOfMonth();
            List<PickupSchedule> pickupSchedules = pickupScheduleRepository.findAllByCompanyIdAndDate(companyId, year, month, day);

            List<TimeSlotResponse> unusedTimeSlots = calculateUnusedTimeSlots(companyId, date, pickupSchedules);
            if (unusedTimeSlots.isEmpty()) {
                return ResponseEntity.ok(
                        Map.of("status", 404, "message", "No unused time slots found for the provided date"));
            }

            return ResponseEntity.ok(
                    Map.of("status", 200, "message", "Time slots found", "timeSlots", unusedTimeSlots));
        } catch (Exception e) {
            return ResponseEntity.ok(
                    Map.of("status", 500, "message", "Error finding unused time slots: " + e.getMessage()));
        }
    }


    public ResponseEntity<?> getSchedulesForCompanyAndDate(Long companyId, LocalDate date) {
        try {
            int year = date.getYear();
            int month = date.getMonthValue();
            int day = date.getDayOfMonth();
            List<PickupSchedule> pickupSchedules = pickupScheduleRepository.findAllByCompanyIdAndDate(companyId, year, month, day);

            List<TimeSlotResponse> unusedTimeSlots = calculateUnusedTimeSlots(companyId, date, pickupSchedules);
            if (unusedTimeSlots.isEmpty()) {
                return ResponseEntity.ok(
                        Map.of("status", 404, "message", "No schedules found for given company and date"));
            }

            return ResponseEntity.ok(unusedTimeSlots);
        } catch (Exception e) {
            return ResponseEntity.ok(
                    Map.of("status", 500, "message", "Error finding schedules for company and date: " + e.getMessage()));
        }
    }

    private List<TimeSlotResponse> calculateUnusedTimeSlots(Long companyId, LocalDate date, List<PickupSchedule> pickupSchedules) {
        List<TimeSlotResponse> unusedTimeSlots = new ArrayList<>();

        // Extract center working hours
        LocalTime openingTime = companyRepository.findById(companyId).get().getTimeOfOpening();
        LocalTime closingTime = companyRepository.findById(companyId).get().getTimeOfClosing();

        if (pickupSchedules.isEmpty()) {
            unusedTimeSlots.add(new TimeSlotResponse(openingTime, closingTime));
            return unusedTimeSlots;
        }

        // Filter pickup schedules for the provided date
        List<PickupSchedule> schedulesForDate = pickupSchedules.stream()
                .filter(schedule -> schedule.getDate().isEqual(date))
                .sorted(Comparator.comparing(PickupSchedule::getTime))
                .collect(Collectors.toList());

        if (schedulesForDate.isEmpty()) {
            unusedTimeSlots.add(new TimeSlotResponse(openingTime, closingTime));
            return unusedTimeSlots;
        }

        LocalTime startTime = openingTime;
        for (PickupSchedule pickupSchedule : schedulesForDate) {
            LocalTime pickupStartTime = pickupSchedule.getTime();
            LocalTime pickupEndTime = pickupStartTime.plusMinutes(pickupSchedule.getDuration());

            if (startTime.isBefore(pickupStartTime)) {
                long gapInMinutes = ChronoUnit.MINUTES.between(startTime, pickupStartTime);
                if (gapInMinutes >= 15) {
                    unusedTimeSlots.add(new TimeSlotResponse(startTime, pickupStartTime.minusMinutes(1)));
                }
            }

            startTime = pickupEndTime.plusMinutes(1);
        }

        if (startTime.isBefore(closingTime)) {
            long gapInMinutes = ChronoUnit.MINUTES.between(startTime, closingTime);
            if (gapInMinutes >= 15) {
                unusedTimeSlots.add(new TimeSlotResponse(startTime, closingTime));
            }
        }

        return unusedTimeSlots;
    }


    public ResponseEntity<?> searchSchedulesByCompanyId(Long companyId) {
        try {
            if (companyId == null)
                return ResponseEntity.ok(
                        Map.of("status", 400, "message", "No schedules found for given company"));

            List<PickupSchedule> pickupSchedules = pickupScheduleRepository.findByCompanyId(companyId);
            if (pickupSchedules.isEmpty())
                return ResponseEntity.ok(
                        Map.of("status", 404, "message", "No schedules found for given company"));

            return ResponseEntity.ok(
                    Map.of("status", 200, "message", "Pickup schedules found", "pickupSchedules", pickupSchedules));

        } catch (Exception e) {
            return ResponseEntity.ok(
                    Map.of("status", 500, "message", "Error searching schedules by company: " + e.getMessage()));
        }
    }

    public ResponseEntity<?> getUserPredefinedSchedules(LocalDate date, LocalTime time) {
        try {
            // Round the input time to either half an hour or whole hour
            LocalTime roundedTime = roundTime(time);

            // Calculate the start time (roundedTime - 1 hour) and end time (roundedTime + 1 hour)
            LocalTime startTime = roundedTime.minusHours(1);
            LocalTime endTime = roundedTime.plusHours(1);

            // Call the repository method with the rounded start and end times
            List<PickupSchedule> pickupSchedules = pickupScheduleRepository.findUserPredefinedSchedules(date, startTime, endTime);

            List<UserPickupScheduleResponse> response = pickupSchedules.stream()
                    .map(pickupSchedule -> new UserPickupScheduleResponse(
                            pickupSchedule.getId(),
                            pickupSchedule.getCompany().getName(),
                            pickupSchedule.getCompany().getAddress(),
                            pickupSchedule.getCompany().getAverageRating(),
                            pickupSchedule.getDate(),
                            pickupSchedule.getTime()
                    ))
                    .collect(Collectors.toList());

            if (response.isEmpty()) {
                return ResponseEntity.ok(
                        Map.of("status", 404, "message", "No schedules found for provided date and time"));
            }
            return ResponseEntity.ok(
                    Map.of("status", 200, "message", "Pickup schedules found", "pickupSchedules", response));

        } catch (Exception e) {
            // If there's an error, return a bad request response with an empty list
            return ResponseEntity.ok(
                    Map.of("status", 500, "message", "Error finding predefined schedules: " + e.getMessage()));

        }
    }

    private LocalTime roundTime(LocalTime time) {
        int minutes = time.getMinute();
        if (minutes >= 0 && minutes < 30) {
            return time.truncatedTo(ChronoUnit.HOURS);
        } else if (minutes >= 30) {
            return time.truncatedTo(ChronoUnit.HOURS).plusMinutes(30);
        }
        return time;
    }

    public ResponseEntity<?> getAllAfter() {
        try {
            LocalDate searchDate = LocalDate.now();

            List<PickupSchedule> pickupSchedules = pickupScheduleRepository.findAllOnOrAfterDate(searchDate.getYear(), searchDate.getMonthValue(), searchDate.getDayOfMonth());

            List<UserPickupScheduleResponse> response = pickupSchedules.stream()
                    .map(pickupSchedule -> new UserPickupScheduleResponse(
                            pickupSchedule.getId(),
                            pickupSchedule.getCompany().getName(),
                            pickupSchedule.getCompany().getAddress(),
                            pickupSchedule.getCompany().getAverageRating(),
                            pickupSchedule.getDate(),
                            pickupSchedule.getTime()
                    ))
                    .collect(Collectors.toList());
            if (response.isEmpty()) {
                return ResponseEntity.ok(
                        Map.of("status", 404, "message", "No schedules found"));
            }
            return ResponseEntity.ok(
                    Map.of("status", 200, "message", "Pickup schedules found", "pickupSchedules", response));

        } catch (Exception e) {
            // If there's an error, return a bad request response with an empty list
            return ResponseEntity.ok(
                    Map.of("status", 500, "message", "Error finding schedules: " + e.getMessage()));
        }

    }

    public ResponseEntity<?> getUserFutureSchedules(User currentUser) {
        try {
            LocalDate currentDate = LocalDate.now();

            List<UserPickupScheduleResponse> response = findUserFutureSchedules(currentUser, currentDate);
            if (response.isEmpty()) {
                return ResponseEntity.ok(
                        Map.of("status", 404, "message", "No schedules found"));
            }
            return ResponseEntity.ok(
                    Map.of("status", 200, "message", "Pickup schedules found", "pickupSchedules", response));

        } catch (Exception e) {
            // If there's an error, return a bad request response with an empty list
            return ResponseEntity.ok(
                    Map.of("status", 500, "message", "Error finding schedules: " + e.getMessage()));
        }

    }

    public List<UserPickupScheduleResponse> findUserFutureSchedules(User user, LocalDate currentDate) {
        CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
        CriteriaQuery<UserPickupScheduleResponse> criteriaQuery = criteriaBuilder.createQuery(UserPickupScheduleResponse.class);
        Root<PickupSchedule> scheduleRoot = criteriaQuery.from(PickupSchedule.class);
        Join<PickupSchedule, EquipmentTransaction> userJoin = scheduleRoot.join("userConnections");

        List<Predicate> predicates = new ArrayList<>();
        predicates.add(criteriaBuilder.equal(userJoin.get("user").get("id"), user.getId()));
        predicates.add(criteriaBuilder.greaterThanOrEqualTo(scheduleRoot.get("date"), currentDate));

        criteriaQuery.select(criteriaBuilder.construct(
                        UserPickupScheduleResponse.class,
                        scheduleRoot.get("id"),
                        scheduleRoot.get("company").get("name"),
                        scheduleRoot.get("company").get("address"),
                        scheduleRoot.get("company").get("averageRating"),
                        scheduleRoot.get("date"),
                        scheduleRoot.get("time")
                )).where(criteriaBuilder.and(predicates.toArray(new Predicate[0])))
                .orderBy(
                        criteriaBuilder.asc(scheduleRoot.get("date")),
                        criteriaBuilder.asc(scheduleRoot.get("time"))
                );

        TypedQuery<UserPickupScheduleResponse> query = entityManager.createQuery(criteriaQuery);
        return query.getResultList();
    }


}
