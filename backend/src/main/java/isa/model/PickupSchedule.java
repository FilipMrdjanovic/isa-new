package isa.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "pickup_schedule")
public class PickupSchedule {
    @Id
    @GeneratedValue
    private Long id;
    private LocalDate date;
    private LocalTime time;
    private int duration;
    private Boolean reserved = false;
    private Boolean active = false;
    private Boolean completed = false;

    @Enumerated(EnumType.STRING)
    private PickupScheduleType pickupScheduleType;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "company_id")
    private Company company;

    @OneToMany(mappedBy = "pickupSchedule", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<EquipmentTransaction> equipmentTransactions;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User companyAdmin;

    @Override
    public String toString() {
        return "PickupSchedule{" +
                "id=" + id +
                ", date=" + date +
                ", time=" + time +
                ", duration=" + duration +
                ", reserved=" + reserved +
                ", active=" + active +
                ", completed=" + completed +
                ", pickupScheduleType=" + pickupScheduleType +
                ", company=" + company +
                ", equipmentTransactions=" + equipmentTransactions +
                ", companyAdmin=" + companyAdmin +
                '}';
    }
}
