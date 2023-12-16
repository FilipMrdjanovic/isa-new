package isa.controller;

import isa.model.Company;
import isa.model.PickupSchedule;
import isa.model.User;
import isa.payload.request.PickupScheduleRequest;
import isa.payload.request.UserPickupScheduleRequest;
import isa.service.PickupScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Map;

@RestController
@RequestMapping("/api/pickup-schedule")
@RequiredArgsConstructor
public class PickupScheduleController {
    private final PickupScheduleService pickupScheduleService;

    @PostMapping("/reserve/{scheduleId}/{equipmentSetId}")
    public ResponseEntity<?> reserveSchedule(@PathVariable Long scheduleId, @PathVariable Long equipmentSetId, @AuthenticationPrincipal User currentUser) {
        return pickupScheduleService.reserveSchedule(scheduleId, equipmentSetId, currentUser);
    }

    @PostMapping("/create/user-defined")
    public ResponseEntity<?> createUserDefinedSchedule(@RequestBody UserPickupScheduleRequest request, @AuthenticationPrincipal User currentUser) {
        return pickupScheduleService.createUserDefinedPickupSchedule(request, currentUser);
    }

    @PostMapping("/create/predefined")
    public ResponseEntity<?> createPredefinedSchedule(@RequestBody PickupScheduleRequest request, @AuthenticationPrincipal User currentUser) {
        return pickupScheduleService.createPickupSchedule(request, currentUser);
    }

    @GetMapping("/dates/with-schedule/{year}/{month}")
    public ResponseEntity<?> getDatesWithSchedule(@PathVariable int year, @PathVariable int month, @AuthenticationPrincipal User currentUser) {
        Company company = currentUser.getCompany();
        if (company == null)
            return ResponseEntity.ok(
                    Map.of("status", 400, "message", "User is not connected to any companies")
            );
        return pickupScheduleService.getDatesWithSchedulesForCompany(company.getId(), year, month);
    }

    @GetMapping("/dates/free-time-slots/{companyId}/{date}")
    public ResponseEntity<?> getUnusedTimeSlotsForCompanyAndDate(@PathVariable Long companyId, @PathVariable LocalDate date) {
        return pickupScheduleService.getUnusedTimeSlots(companyId, date);
    }

    @GetMapping("/{date}")
    public ResponseEntity<?> getSchedulesForCompanyAndDate(@PathVariable LocalDate date, @AuthenticationPrincipal User currentUser) {
        Company company = currentUser.getCompany();
        if (company == null)
            return ResponseEntity.ok(
                    Map.of("status", 400, "message", "User is not connected to any companies")
            );
        return pickupScheduleService.getSchedulesForCompanyAndDate(company.getId(), date);
    }

    @GetMapping("/available/{companyId}")
    public ResponseEntity<?> getAvailableSchedulesForCompany(@PathVariable Long companyId) {
        return pickupScheduleService.getAvailableSchedulesForCompany(companyId);
    }

    @GetMapping("/search/{id}")
    public ResponseEntity<?> searchSchedulesByCompanyId(@PathVariable("id") Long id) {
        return pickupScheduleService.searchSchedulesByCompanyId(id);
    }

    @GetMapping("/all/{date}/{time}")
    public ResponseEntity<?> getUserPredefinedSchedules(@PathVariable LocalDate date, @PathVariable LocalTime time) {
        return pickupScheduleService.getUserPredefinedSchedules(date, time);
    }

    @GetMapping("/all/after")
    public ResponseEntity<?> getAllAfter() {
        return pickupScheduleService.getAllAfter();
    }

    @GetMapping("/future-appointments")
    public ResponseEntity<?> getUserFutureSchedules(@AuthenticationPrincipal User currentUser) {
        return pickupScheduleService.getUserFutureSchedules(currentUser);
    }

}
