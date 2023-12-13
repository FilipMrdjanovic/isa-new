package isa.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPickupScheduleRequest {
    private Long id;
    private LocalDate date;
    private LocalTime time;
    private Long equipmentSetId;
}
