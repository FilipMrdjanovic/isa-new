package isa.repository;

import isa.model.EquipmentSet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EquipmentSetRepository extends JpaRepository<EquipmentSet, Long> {
    List<EquipmentSet> findByCompanyId(Long id);

    @Query("SELECT es FROM EquipmentSet es " +
            "WHERE es.company.id = :companyId " + // Modify to reference the company ID
            "AND (:searchText IS NULL " +
            "OR LOWER(es.equipment.name) LIKE LOWER(CONCAT('%', :searchText, '%')) " +
            "OR LOWER(es.equipment.description) LIKE LOWER(CONCAT('%', :searchText, '%')))" +
            "AND (:minQuantity IS NULL OR es.quantity >= :minQuantity) " +
            "AND (:maxQuantity IS NULL OR es.quantity <= :maxQuantity) " +
            "ORDER BY es.quantity ASC")
    List<EquipmentSet> findByCompanyIdAndTextAndQuantityRange(
            @Param("companyId") Long companyId, // Include companyId as a parameter
            @Param("searchText") String searchText,
            @Param("minQuantity") Integer minQuantity,
            @Param("maxQuantity") Integer maxQuantity);

    // Updated query to filter by company ID and exact quantity
    @Query("SELECT es FROM EquipmentSet es " +
            "WHERE es.company.id = :companyId " + // Modify to reference the company ID
            "AND es.quantity = :exactQuantity " +
            "AND (:searchText IS NULL " +
            "OR LOWER(es.equipment.name) LIKE LOWER(CONCAT('%', :searchText, '%')) " +
            "OR LOWER(es.equipment.description) LIKE LOWER(CONCAT('%', :searchText, '%')))")
    List<EquipmentSet> findByCompanyIdAndTextAndExactQuantity(
            @Param("companyId") Long companyId, // Include companyId as a parameter
            @Param("searchText") String searchText,
            @Param("exactQuantity") Integer exactQuantity);
}
