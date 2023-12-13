package isa.repository;

import isa.model.PickupSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface PickupScheduleRepository extends JpaRepository<PickupSchedule, Long> {

    List<PickupSchedule> findByCompanyId(Long companyId);

    @Query("SELECT DISTINCT DATE(ps.date) FROM PickupSchedule ps WHERE ps.company.id = :companyId AND YEAR(ps.date) = :year AND MONTH(ps.date) = :month")
    List<String> findDatesWithSchedulesForCompany(@Param("companyId") Long companyId, @Param("year") int year, @Param("month") int month);

    @Query(value = "SELECT * FROM pickup_schedule " +
            "WHERE company_id = :companyId " +
            "AND EXTRACT(YEAR FROM date) = :year " +
            "AND EXTRACT(MONTH FROM date) = :month " +
            "AND EXTRACT(DAY FROM date) = :day", nativeQuery = true)
    List<PickupSchedule> findAllByCompanyIdAndDate(Long companyId, int year, int month, int day);

    @Query("SELECT ps FROM PickupSchedule ps " +
            "WHERE ps.date = :date " +
            "AND ps.time >= :startTime " +
            "AND ps.time <= :endTime " +
            "ORDER BY ps.time")
    List<PickupSchedule> findCompanySchedules(
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );

    @Query("SELECT ps FROM PickupSchedule ps " +
            "WHERE EXTRACT(YEAR FROM ps.date) >= :year " +
            "AND EXTRACT(MONTH FROM ps.date) >= :month " +
            "AND EXTRACT(DAY FROM ps.date) >= :day")
    List<PickupSchedule> findAllOnOrAfterDate(
            @Param("year") int year,
            @Param("month") int month,
            @Param("day") int day
    );
}
