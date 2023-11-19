package isa.repository;

import isa.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CompanyRepository extends JpaRepository<Company, Long> {

    @Query("SELECT c FROM Company c " +
            "WHERE (:searchText IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :searchText, '%')) OR LOWER(c.address) LIKE LOWER(CONCAT('%', :searchText, '%')) OR LOWER(c.city) LIKE LOWER(CONCAT('%', :searchText, '%'))) " +
            "AND (:minRating IS NULL OR c.averageRating >= :minRating) " +
            "AND (:maxRating IS NULL OR c.averageRating <= :maxRating) " +
            "ORDER BY c.averageRating ASC")
    List<Company> findByFilters(
            @Param("searchText") String searchText,
            @Param("minRating") Double minRating,
            @Param("maxRating") Double maxRating);

    @Query("SELECT c FROM Company c " +
            "WHERE (:searchText IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :searchText, '%')) OR LOWER(c.address) LIKE LOWER(CONCAT('%', :searchText, '%')) OR LOWER(c.city) LIKE LOWER(CONCAT('%', :searchText, '%'))) " +
            "AND (:exactRating IS NULL OR c.averageRating = :exactRating) " +
            "ORDER BY c.averageRating ASC")
    List<Company> findByFiltersTextAndExactRating(
            @Param("searchText") String searchText,
            @Param("exactRating") Double exactRating);

    List<Company> findByAverageRating(Double averageRating);
}
