package isa.repository;

import isa.model.EquipmentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EquipmentTransactionRepository extends JpaRepository<EquipmentTransaction, Long> {
}
