package et.gov.police.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Employee — stores HR-specific personnel details for every police staff member.
 * Linked one-to-one with the User account (authentication/authorisation).
 * Table name: employees
 */
@Entity
@Table(name = "employees", indexes = {
    @Index(name = "idx_emp_badge",      columnList = "badge_number",  unique = true),
    @Index(name = "idx_emp_national_id",columnList = "national_id",   unique = true),
    @Index(name = "idx_emp_user",       columnList = "user_id",       unique = true),
    @Index(name = "idx_emp_department", columnList = "department"),
    @Index(name = "idx_emp_status",     columnList = "employment_status")
})
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ── Link to User account ─────────────────────────────────────
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // ── Personal Information ─────────────────────────────────────
    @NotBlank
    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(name = "national_id", unique = true, length = 50)
    private String nationalId;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private Gender gender;

    @Column(length = 20)
    private String phone;

    @Column(length = 150)
    private String email;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(length = 100)
    private String city;

    // ── Official Details ─────────────────────────────────────────
    @NotBlank
    @Column(name = "badge_number", nullable = false, unique = true, length = 30)
    private String badgeNumber;

    @Column(length = 80)
    private String rank;

    @Column(length = 80)
    private String department;

    @Column(length = 80)
    private String division;

    @Column(name = "joining_date")
    private LocalDate joiningDate;

    @Column(name = "contract_type", length = 30)
    private String contractType;   // PERMANENT, TEMPORARY, CONTRACT

    @Enumerated(EnumType.STRING)
    @Column(name = "employment_status", nullable = false, length = 20)
    private EmploymentStatus employmentStatus = EmploymentStatus.ACTIVE;

    // ── Salary / Payroll base ────────────────────────────────────
    @Column(name = "basic_salary", precision = 10)
    private java.math.BigDecimal basicSalary;

    @Column(name = "bank_name", length = 80)
    private String bankName;

    @Column(name = "bank_account", length = 40)
    private String bankAccount;

    // ── Emergency Contact ────────────────────────────────────────
    @Column(name = "emergency_contact_name", length = 150)
    private String emergencyContactName;

    @Column(name = "emergency_contact_phone", length = 20)
    private String emergencyContactPhone;

    @Column(name = "emergency_contact_relation", length = 60)
    private String emergencyContactRelation;

    // ── Documents / Notes ────────────────────────────────────────
    @Column(name = "photo_url", length = 500)
    private String photoUrl;

    @Column(name = "id_document_url", length = 500)
    private String idDocumentUrl;

    @Column(columnDefinition = "TEXT")
    private String notes;

    // ── Registered by ────────────────────────────────────────────
    @ManyToOne
    @JoinColumn(name = "registered_by_id")
    private User registeredBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ── Enums ─────────────────────────────────────────────────────
    public enum Gender {
        MALE, FEMALE, OTHER
    }

    public enum EmploymentStatus {
        ACTIVE,
        ON_LEAVE,
        SUSPENDED,
        TERMINATED,
        RETIRED
    }

    // ── Constructors ─────────────────────────────────────────────
    public Employee() {}

    // ── Getters ───────────────────────────────────────────────────
    public Long              getId()                        { return id; }
    public User              getUser()                      { return user; }
    public String            getFullName()                  { return fullName; }
    public String            getNationalId()                { return nationalId; }
    public LocalDate         getDateOfBirth()               { return dateOfBirth; }
    public Gender            getGender()                    { return gender; }
    public String            getPhone()                     { return phone; }
    public String            getEmail()                     { return email; }
    public String            getAddress()                   { return address; }
    public String            getCity()                      { return city; }
    public String            getBadgeNumber()               { return badgeNumber; }
    public String            getRank()                      { return rank; }
    public String            getDepartment()                { return department; }
    public String            getDivision()                  { return division; }
    public LocalDate         getJoiningDate()               { return joiningDate; }
    public String            getContractType()              { return contractType; }
    public EmploymentStatus  getEmploymentStatus()          { return employmentStatus; }
    public java.math.BigDecimal getBasicSalary()            { return basicSalary; }
    public String            getBankName()                  { return bankName; }
    public String            getBankAccount()               { return bankAccount; }
    public String            getEmergencyContactName()      { return emergencyContactName; }
    public String            getEmergencyContactPhone()     { return emergencyContactPhone; }
    public String            getEmergencyContactRelation()  { return emergencyContactRelation; }
    public String            getPhotoUrl()                  { return photoUrl; }
    public String            getIdDocumentUrl()             { return idDocumentUrl; }
    public String            getNotes()                     { return notes; }
    public User              getRegisteredBy()              { return registeredBy; }
    public LocalDateTime     getCreatedAt()                 { return createdAt; }
    public LocalDateTime     getUpdatedAt()                 { return updatedAt; }

    // ── Setters ───────────────────────────────────────────────────
    public void setId(Long v)                                       { this.id = v; }
    public void setUser(User v)                                     { this.user = v; }
    public void setFullName(String v)                               { this.fullName = v; }
    public void setNationalId(String v)                             { this.nationalId = v; }
    public void setDateOfBirth(LocalDate v)                         { this.dateOfBirth = v; }
    public void setGender(Gender v)                                 { this.gender = v; }
    public void setPhone(String v)                                  { this.phone = v; }
    public void setEmail(String v)                                  { this.email = v; }
    public void setAddress(String v)                                { this.address = v; }
    public void setCity(String v)                                   { this.city = v; }
    public void setBadgeNumber(String v)                            { this.badgeNumber = v; }
    public void setRank(String v)                                   { this.rank = v; }
    public void setDepartment(String v)                             { this.department = v; }
    public void setDivision(String v)                               { this.division = v; }
    public void setJoiningDate(LocalDate v)                         { this.joiningDate = v; }
    public void setContractType(String v)                           { this.contractType = v; }
    public void setEmploymentStatus(EmploymentStatus v)             { this.employmentStatus = v; }
    public void setBasicSalary(java.math.BigDecimal v)              { this.basicSalary = v; }
    public void setBankName(String v)                               { this.bankName = v; }
    public void setBankAccount(String v)                            { this.bankAccount = v; }
    public void setEmergencyContactName(String v)                   { this.emergencyContactName = v; }
    public void setEmergencyContactPhone(String v)                  { this.emergencyContactPhone = v; }
    public void setEmergencyContactRelation(String v)               { this.emergencyContactRelation = v; }
    public void setPhotoUrl(String v)                               { this.photoUrl = v; }
    public void setIdDocumentUrl(String v)                          { this.idDocumentUrl = v; }
    public void setNotes(String v)                                  { this.notes = v; }
    public void setRegisteredBy(User v)                             { this.registeredBy = v; }
}
