package isa.repository;

import isa.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CompanyRepository extends JpaRepository<Company, Long> {

    @Query("SELECT c FROM Company c " +
            "WHERE (:searchText IS NULL OR c.name LIKE %:searchText% OR c.address LIKE %:searchText% OR c.city LIKE %:searchText%) " +
            "AND (:minRating IS NULL OR c.averageRating >= :minRating) " +
            "AND (:maxRating IS NULL OR c.averageRating <= :maxRating) " +
            "ORDER BY c.averageRating ASC") // Use DESC for descending order
    List<Company> findByFilters(
            @Param("searchText") String searchText,
            @Param("minRating") Double minRating,
            @Param("maxRating") Double maxRating);

    List<Company> findByAverageRating(Double averageRating);
}
