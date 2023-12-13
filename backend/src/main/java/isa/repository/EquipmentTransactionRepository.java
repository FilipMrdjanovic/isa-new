package isa.repository;

import isa.model.EquipmentTransaction;
import isa.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EquipmentTransactionRepository extends JpaRepository<EquipmentTransaction, Long> {
    List<EquipmentTransaction> findByUser(User user);
}
