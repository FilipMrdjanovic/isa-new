package isa.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import isa.payload.request.UpdateForm;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "_user")
public class User implements UserDetails {
    @Id
    @GeneratedValue
    private Long id;
    private String email;
    @JsonIgnore
    private String password;
    private String firstname;
    private String lastname;
    private String city;
    private String country;
    private String phone;
    private String occupation;
    private String organization;
    private int loyaltyPoints;
    private int penaltyPoints;

    @Enumerated(EnumType.STRING)
    private Role role;

    private Boolean locked = false;
    private Boolean enabled = false;

    private String verificationCode;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    // Inside your User class
    public void updateForm(UpdateForm updateForm) {
        this.firstname = updateForm.getFirstname();
        this.lastname = updateForm.getLastname();
        this.city = updateForm.getCity();
        this.country = updateForm.getCountry();
        this.phone = updateForm.getPhone();
        this.loyaltyPoints = updateForm.getLoyaltyPoints();
        this.penaltyPoints = updateForm.getPenaltyPoints();
        this.occupation = updateForm.getOccupation();
        this.organization = updateForm.getOrganization();
    }


    @Override
    public String getUsername(){
        return email;
    }
    @Override
    public String getPassword() {
        return password;
    }
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    @Override
    public boolean isAccountNonLocked() {
        return !locked;
    }
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    @Override
    public boolean isEnabled() {
        return enabled;
    }
}
