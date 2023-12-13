package isa.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "equipment_set")
public class EquipmentSet {
    @Id
    @GeneratedValue
    private Long id;
    private int quantity;

    private boolean available = true;
    @ManyToOne
    @JoinColumn(name = "equipment_id")
    private Equipment equipment;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "company_id")
    private Company company;

    public EquipmentSet(int quantity, Equipment equipment, Company company) {
        this.quantity = quantity;
        this.equipment = equipment;
        this.company = company;
    }

    @Override
    public String toString() {
        return "EquipmentSet{" +
                "id=" + id +
                ", quantity=" + quantity +
                ", available=" + available +
                '}';
    }
}
