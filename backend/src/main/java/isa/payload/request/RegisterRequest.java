package isa.payload.request;

import isa.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    private String firstname;
    private String lastname;
    private String email;
    private String password;
    private String role;

    // Additional attributes for the registration process
    private String address;
    private String city;
    private String country;
    private String phone;
    private String jmbg;
    private String gender;
    private String occupation;
    private String organization;

}
