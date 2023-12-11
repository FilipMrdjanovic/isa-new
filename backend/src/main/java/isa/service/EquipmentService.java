package isa.service;

import isa.model.Company;
import isa.model.Equipment;
import isa.model.EquipmentSet;
import isa.payload.response.CompanyFilterResponse;
import isa.repository.EquipmentRepository;
import isa.repository.EquipmentSetRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static isa.service.ServiceUtils.allParametersEmpty;

@Service
@AllArgsConstructor
public class EquipmentService {
    private final EquipmentRepository equipmentRepository;
    private final EquipmentSetRepository equipmentSetRepository;

    public List<Equipment> getAllEquipments() {
        return equipmentRepository.findAll();
    }

    public Optional<Equipment> getEquipmentById(Long id) {
        return equipmentRepository.findById(id);
    }

    public Equipment saveEquipment(Equipment equipment) {
        return equipmentRepository.save(equipment);
    }

    public void deleteEquipment(Long id) {
        equipmentRepository.deleteById(id);
    }

    public List<EquipmentSet> getEquipmentSetsByCompanyId(Long companyId) {
        return equipmentSetRepository.findByCompanyId(companyId);
    }

    public ResponseEntity<?> filterEquipment(
            Long companyId, String searchText, Integer minQuantity, Integer maxQuantity, Integer exactQuantity) {

        if (allParametersEmpty(companyId, searchText, minQuantity, maxQuantity, exactQuantity)) {
            return ResponseEntity.ok(
                    Map.of("status", 400, "message", "Please provide at least one filter parameter"));
        }

        List<EquipmentSet> equipmentSets = getFilteredEquipmentSets(companyId, searchText, minQuantity, maxQuantity, exactQuantity);

        if (equipmentSets.isEmpty()) {
            return ResponseEntity.ok(
                    Map.of("status", 404, "message", "No equipment sets found")
            );
        } else {
            return ResponseEntity.ok(equipmentSets);
        }
    }

    private List<EquipmentSet> getFilteredEquipmentSets(
            Long companyId, String searchText, Integer minQuantity, Integer maxQuantity, Integer exactQuantity) {

        if (exactQuantity != null) {
            return equipmentSetRepository.findByCompanyIdAndTextAndExactQuantity(companyId, searchText, exactQuantity);
        } else {
            return equipmentSetRepository.findByCompanyIdAndTextAndQuantityRange(companyId, searchText, minQuantity, maxQuantity);
        }
    }
}
