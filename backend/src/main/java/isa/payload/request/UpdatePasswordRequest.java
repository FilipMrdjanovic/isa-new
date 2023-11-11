package isa.payload.request;

import lombok.Data;

@Data
public class UpdatePasswordRequest {
    private String currentPassword;
    private String newPassword;
}
