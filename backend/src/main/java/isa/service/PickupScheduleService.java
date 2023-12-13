package isa.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import isa.model.*;
import isa.payload.request.PickupScheduleRequest;
import isa.payload.request.UserPickupScheduleRequest;
import isa.repository.CompanyRepository;
import isa.repository.EquipmentSetRepository;
import isa.repository.EquipmentTransactionRepository;
import isa.repository.PickupScheduleRepository;
import isa.service.mailing.EmailSender;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@AllArgsConstructor
public class PickupScheduleService {

    private final PickupScheduleRepository pickupScheduleRepository;
    private final CompanyRepository companyRepository;
    private final EquipmentSetRepository equipmentSetRepository;
    private final EquipmentTransactionRepository equipmentTransactionRepository;
    private final UserService userService;
    private final EmailSender emailSender;


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
                    .reserved(false)
                    .active(true)
                    .pickupScheduleType(PickupScheduleType.PREDEFINED)
                    .company(company)
                    .companyAdmin(user)
                    .build();

            PickupSchedule savedPickupSchedule = pickupScheduleRepository.save(pickupSchedule);
            return ResponseEntity.ok(savedPickupSchedule);
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

            return ResponseEntity.ok(savedPickupSchedule);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.ok(
                    Map.of("status", 400, "message", e.getMessage()));
        }
    }

    private void sendQrCodeConfirmation(User user, EquipmentTransaction transaction){
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


}
