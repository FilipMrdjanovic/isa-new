package isa.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompanyFilterResponse {
    private Long id;
    private String companyName;
    private String address;
    private Double averageRating;
}
