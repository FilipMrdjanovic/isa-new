package isa.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer"})
public class Company {
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    private String address;
    private String city;
    private Double averageRating;
    private LocalTime timeOfOpening;
    private LocalTime timeOfClosing;
    private int minDuration; // In minutes
    private int maxDuration; // In minutes

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    @JsonIgnoreProperties({"company"})
    private List<EquipmentSet> equipmentSets;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    @JsonIgnoreProperties({"company"})
    private List<PickupSchedule> pickupSchedules;

    @Override
    public String toString() {
        return "Company{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", address='" + address + '\'' +
                ", city='" + city + '\'' +
                ", averageRating=" + averageRating +
                ", timeOfOpening=" + timeOfOpening +
                ", timeOfClosing=" + timeOfClosing +
                ", minDuration=" + minDuration +
                ", maxDuration=" + maxDuration +
                ", equipmentSets=" + equipmentSets +
                ", pickupSchedules=" + pickupSchedules +
                '}';
    }
}
