package et.gov.police.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ResetPasswordRequest {

    @NotBlank @Email
    private String email;

    @NotBlank
    @Size(min = 6, max = 6)
    private String otp;

    @NotBlank
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String newPassword;

    public ResetPasswordRequest() {}

    public String getEmail()               { return email; }
    public String getOtp()                 { return otp; }
    public String getNewPassword()         { return newPassword; }
    public void   setEmail(String v)       { this.email       = v; }
    public void   setOtp(String v)         { this.otp         = v; }
    public void   setNewPassword(String v) { this.newPassword = v; }
}
