package isa.model;

import org.springframework.security.core.GrantedAuthority;

public enum Role implements GrantedAuthority {
    USER,
    COMPANY_ADMIN,
    SYSTEM_ADMIN;

    @Override
    public String getAuthority() {
        return name();
    }
}
