package isa.repository;

import isa.model.EquipmentSet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EquipmentSetRepository extends JpaRepository<EquipmentSet, Long> {
    List<EquipmentSet> findByCompanyId(Long id);
}
