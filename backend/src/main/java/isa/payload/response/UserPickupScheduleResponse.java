package isa.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPickupScheduleResponse {
    private Long id;
    private String name;
    private String address;
    private Double averageRating;
    private LocalDate date;
    private LocalTime time;
}
