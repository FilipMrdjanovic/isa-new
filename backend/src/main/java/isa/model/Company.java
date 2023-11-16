package isa.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    @JsonIgnoreProperties({"company"})
    private List<EquipmentSet> equipmentSets;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    @JsonIgnoreProperties({"company"})
    private List<PickupSchedule> pickupSchedules;

    public Company(String name, String address, String city, Double averageRating) {
        this.name = name;
        this.address = address;
        this.city = city;
        this.averageRating = averageRating;
    }
}
