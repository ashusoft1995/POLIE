package et.gov.police.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    @NotBlank(message = "Username or email is required")
    private String identifier;

    @NotBlank(message = "Password is required")
    private String password;

    public LoginRequest() {}

    public String getIdentifier() { return identifier; }
    public String getPassword()   { return password; }
    public void setIdentifier(String v) { this.identifier = v; }
    public void setPassword(String v)   { this.password   = v; }
}
