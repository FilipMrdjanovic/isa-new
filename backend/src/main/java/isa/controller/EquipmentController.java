package isa.controller;

import isa.model.Equipment;
import isa.model.EquipmentSet;
import isa.service.EquipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/equipment")
@RequiredArgsConstructor
public class EquipmentController {

    private final EquipmentService equipmentService;

    @GetMapping("/all")
    public ResponseEntity<?> getAllEquipments() {
        List<Equipment> equipments = equipmentService.getAllEquipments();
        if (!equipments.isEmpty()) {
            return ResponseEntity.ok(
                    Map.of("status", 200, "message", "Equipments found", "equipments", equipments)
            );
        } else {
            return ResponseEntity.ok(
                    Map.of("status", 404, "message", "No equipments found")
            );
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEquipmentById(@PathVariable Long id) {
        return equipmentService.getEquipmentById(id)
                .map(equipment -> ResponseEntity.ok(
                        Map.of("status", 200, "message", "Equipment found", "equipment", equipment))
                )
                .orElse(ResponseEntity.ok(
                        Map.of("status", 404, "message", "Equipment not found")
                ));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addEquipment(@RequestBody Equipment equipment) {
        Equipment savedEquipment = equipmentService.saveEquipment(equipment);
        return ResponseEntity.ok(
                Map.of("status", 200, "message", "Equipment added successfully", "equipment", savedEquipment)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEquipment(@PathVariable Long id) {
        equipmentService.deleteEquipment(id);
        return ResponseEntity.ok(
                Map.of("status", 200, "message", "Equipment deleted successfully")
        );
    }

    @GetMapping("/sets/{companyId}")
    public ResponseEntity<?> getEquipmentSetsByCompanyId(@PathVariable Long companyId) {
        List<EquipmentSet> equipmentSets = equipmentService.getEquipmentSetsByCompanyId(companyId);
        if (!equipmentSets.isEmpty()) {
            return ResponseEntity.ok(
                    Map.of("status", 200, "message", "Equipment sets found", "equipmentSets", equipmentSets)
            );
        } else {
            return ResponseEntity.ok(
                    Map.of("status", 404, "message", "No equipment sets found for the company")
            );
        }
    }
}
