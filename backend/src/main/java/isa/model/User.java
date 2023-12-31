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
    @JsonIgnore
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
    @JsonIgnore
    private String verificationCode;
    @Enumerated(EnumType.STRING)
    @JsonIgnore
    private Role role;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id")
    @JsonIgnore
    private Company company;
    @JsonIgnore
    private Boolean locked = false;
    @JsonIgnore
    private Boolean enabled = false;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<EquipmentTransaction> transactions;

    @JsonIgnore
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

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

    @JsonIgnore
    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @JsonIgnore
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @JsonIgnore
    @Override
    public boolean isAccountNonLocked() {
        return !locked;
    }

    @JsonIgnore
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @JsonIgnore
    @Override
    public boolean isEnabled() {
        return enabled;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", firstname='" + firstname + '\'' +
                ", lastname='" + lastname + '\'' +
                ", city='" + city + '\'' +
                ", country='" + country + '\'' +
                ", phone='" + phone + '\'' +
                ", occupation='" + occupation + '\'' +
                ", organization='" + organization + '\'' +
                ", loyaltyPoints=" + loyaltyPoints +
                ", penaltyPoints=" + penaltyPoints +
                ", verificationCode='" + verificationCode + '\'' +
                ", role=" + role +
                ", company=" + company +
                ", locked=" + locked +
                ", enabled=" + enabled +
                ", transactions=" + transactions +
                '}';
    }
}
