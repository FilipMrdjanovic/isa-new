package isa.controller;

import isa.model.PickupSchedule;
import isa.model.User;
import isa.payload.request.UserPickupScheduleRequest;
import isa.service.PickupScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/pickup-schedule")
@RequiredArgsConstructor
public class PickupScheduleController {
    private final PickupScheduleService pickupScheduleService;

    @PostMapping("/create")
    public ResponseEntity<?> createUserDefinedAppointment(@RequestBody UserPickupScheduleRequest request, @AuthenticationPrincipal User currentUser) {
        ResponseEntity<?> response = pickupScheduleService.createUserDefinedPickupSchedule(request, currentUser);
//        if (response.getStatusCodeValue() == 200)
//            return ResponseEntity.ok(
//                    Map.of("status", 200, "message", "Pickup schedule successfully created")
//            );
        return response;
    }
}
