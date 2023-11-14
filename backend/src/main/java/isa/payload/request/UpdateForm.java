package isa.payload.request;
import lombok.Data;

@Data
public class UpdateForm {
    private String firstname;
    private String lastname;
    private String city;
    private String country;
    private String phone;
    private int loyaltyPoints;
    private int penaltyPoints;
    private String occupation;
    private String organization;
}
