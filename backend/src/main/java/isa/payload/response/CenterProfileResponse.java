package isa.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CenterProfileResponse {
    private Long id;
    private String centerName;
    private String address;
    private Double averageRating;
}
