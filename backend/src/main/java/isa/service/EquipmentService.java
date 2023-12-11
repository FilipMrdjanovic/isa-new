package isa.service;

import isa.model.Equipment;
import isa.model.EquipmentSet;
import isa.repository.EquipmentRepository;
import isa.repository.EquipmentSetRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
}
