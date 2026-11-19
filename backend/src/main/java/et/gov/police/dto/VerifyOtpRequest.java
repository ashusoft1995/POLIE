package et.gov.police.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class VerifyOtpRequest {

    @NotBlank @Email
    private String email;

    @NotBlank
    @Size(min = 6, max = 6, message = "OTP must be exactly 6 digits")
    private String otp;

    public VerifyOtpRequest() {}

    public String getEmail()         { return email; }
    public String getOtp()           { return otp; }
    public void   setEmail(String v) { this.email = v; }
    public void   setOtp(String v)   { this.otp   = v; }
}
