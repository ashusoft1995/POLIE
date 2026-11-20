package et.gov.police.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * DTO for registering a new employee (officer).
 * HR Manager submits this via POST /api/employees
 */
public class EmployeeRequest {

    // ── Personal ─────────────────────────────────────────────────
    @NotBlank(message = "Full name is required")
    @Size(min = 4, max = 150, message = "Full name must be between 4 and 150 characters")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Name can only contain letters and spaces")
    private String fullName;

    @NotBlank(message = "National ID is required")
    @Size(min = 5, max = 50, message = "National ID must be between 5 and 50 characters")
    private String nationalId;

    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;

    private String gender;   // MALE | FEMALE | OTHER

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^(09|07)\\d{8}$",
             message = "Phone must start with 09 or 07 and have 10 digits")
    private String phone;

    @Email(message = "Invalid email address")
    private String email;

    @NotBlank(message = "Address is required")
    @Size(min = 4, message = "Address must be at least 4 characters")
    private String address;

    private String city;

    // ── Official ─────────────────────────────────────────────────
    @NotBlank(message = "Badge number is required")
    @Size(min = 3, max = 30, message = "Badge number must be between 3 and 30 characters")
    private String badgeNumber;

    @NotBlank(message = "Rank is required")
    private String rank;

    @NotBlank(message = "Department is required")
    private String department;

    private String division;

    @NotNull(message = "Joining date is required")
    private LocalDate joiningDate;

    private String contractType;   // PERMANENT | TEMPORARY | CONTRACT

    // ── Payroll ──────────────────────────────────────────────────
    @DecimalMin(value = "0.0", inclusive = false, message = "Basic salary must be greater than 0")
    private BigDecimal basicSalary;

    private String bankName;
    private String bankAccount;

    // ── Emergency Contact ─────────────────────────────────────────
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String emergencyContactRelation;

    // ── Notes ─────────────────────────────────────────────────────
    private String notes;

    // ── Linked user account (optional — HR can create with or without) ──
    private Long userId;

    // ── Auto-create a login account ──────────────────────────────
    private String username;
    private String initialPassword;
    private String role;   // Role enum string e.g. DETECTIVE

    // Getters
    public String    getFullName()                 { return fullName; }
    public String    getNationalId()               { return nationalId; }
    public LocalDate getDateOfBirth()              { return dateOfBirth; }
    public String    getGender()                   { return gender; }
    public String    getPhone()                    { return phone; }
    public String    getEmail()                    { return email; }
    public String    getAddress()                  { return address; }
    public String    getCity()                     { return city; }
    public String    getBadgeNumber()              { return badgeNumber; }
    public String    getRank()                     { return rank; }
    public String    getDepartment()               { return department; }
    public String    getDivision()                 { return division; }
    public LocalDate getJoiningDate()              { return joiningDate; }
    public String    getContractType()             { return contractType; }
    public BigDecimal getBasicSalary()             { return basicSalary; }
    public String    getBankName()                 { return bankName; }
    public String    getBankAccount()              { return bankAccount; }
    public String    getEmergencyContactName()     { return emergencyContactName; }
    public String    getEmergencyContactPhone()    { return emergencyContactPhone; }
    public String    getEmergencyContactRelation() { return emergencyContactRelation; }
    public String    getNotes()                    { return notes; }
    public Long      getUserId()                   { return userId; }
    public String    getUsername()                 { return username; }
    public String    getInitialPassword()          { return initialPassword; }
    public String    getRole()                     { return role; }

    // Setters
    public void setFullName(String v)                   { this.fullName = v; }
    public void setNationalId(String v)                 { this.nationalId = v; }
    public void setDateOfBirth(LocalDate v)             { this.dateOfBirth = v; }
    public void setGender(String v)                     { this.gender = v; }
    public void setPhone(String v)                      { this.phone = v; }
    public void setEmail(String v)                      { this.email = v; }
    public void setAddress(String v)                    { this.address = v; }
    public void setCity(String v)                       { this.city = v; }
    public void setBadgeNumber(String v)                { this.badgeNumber = v; }
    public void setRank(String v)                       { this.rank = v; }
    public void setDepartment(String v)                 { this.department = v; }
    public void setDivision(String v)                   { this.division = v; }
    public void setJoiningDate(LocalDate v)             { this.joiningDate = v; }
    public void setContractType(String v)               { this.contractType = v; }
    public void setBasicSalary(BigDecimal v)            { this.basicSalary = v; }
    public void setBankName(String v)                   { this.bankName = v; }
    public void setBankAccount(String v)                { this.bankAccount = v; }
    public void setEmergencyContactName(String v)       { this.emergencyContactName = v; }
    public void setEmergencyContactPhone(String v)      { this.emergencyContactPhone = v; }
    public void setEmergencyContactRelation(String v)   { this.emergencyContactRelation = v; }
    public void setNotes(String v)                      { this.notes = v; }
    public void setUserId(Long v)                       { this.userId = v; }
    public void setUsername(String v)                   { this.username = v; }
    public void setInitialPassword(String v)            { this.initialPassword = v; }
    public void setRole(String v)                       { this.role = v; }
}
