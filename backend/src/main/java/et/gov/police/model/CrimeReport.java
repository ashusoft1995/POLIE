package et.gov.police.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "crime_reports")
public class CrimeReport {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String reporterName;
    
    @Column(nullable = false)
    private String reporterPhone;
    
    private String reporterEmail;
    
    @Column(nullable = false)
    private String reporterAddress;
    
    @Column(nullable = false)
    private String crimeType;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private String incidentLocation;
    
    @Column(nullable = false)
    private LocalDateTime incidentDate;
    
    private String suspectDescription;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ReportStatus status = ReportStatus.PENDING;
    
    @Column(nullable = false)
    private LocalDateTime submittedAt = LocalDateTime.now();
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_to")
    @JsonIgnoreProperties({"password","resetOtp","resetOtpExpiry","failedLoginAttempts","accountLocked","enabled","lastLoginAt","createdAt","updatedAt"})
    private User assignedOfficer;
    
    private LocalDateTime assignedAt;
    
    @Column(columnDefinition = "TEXT")
    private String officerNotes;
    
    private String caseNumber;
    
    private Boolean isUrgent = false;
    
    public enum ReportStatus {
        PENDING,
        UNDER_REVIEW,
        ASSIGNED,
        INVESTIGATING,
        RESOLVED,
        CLOSED,
        REJECTED
    }
    
    // Constructors
    public CrimeReport() {}
    
    // Getters
    public Long getId() { return id; }
    public String getReporterName() { return reporterName; }
    public String getReporterPhone() { return reporterPhone; }
    public String getReporterEmail() { return reporterEmail; }
    public String getReporterAddress() { return reporterAddress; }
    public String getCrimeType() { return crimeType; }
    public String getDescription() { return description; }
    public String getIncidentLocation() { return incidentLocation; }
    public LocalDateTime getIncidentDate() { return incidentDate; }
    public String getSuspectDescription() { return suspectDescription; }
    public ReportStatus getStatus() { return status; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public User getAssignedOfficer() { return assignedOfficer; }
    public LocalDateTime getAssignedAt() { return assignedAt; }
    public String getOfficerNotes() { return officerNotes; }
    public String getCaseNumber() { return caseNumber; }
    public Boolean getIsUrgent() { return isUrgent; }
    
    // Setters
    public void setId(Long id) { this.id = id; }
    public void setReporterName(String reporterName) { this.reporterName = reporterName; }
    public void setReporterPhone(String reporterPhone) { this.reporterPhone = reporterPhone; }
    public void setReporterEmail(String reporterEmail) { this.reporterEmail = reporterEmail; }
    public void setReporterAddress(String reporterAddress) { this.reporterAddress = reporterAddress; }
    public void setCrimeType(String crimeType) { this.crimeType = crimeType; }
    public void setDescription(String description) { this.description = description; }
    public void setIncidentLocation(String incidentLocation) { this.incidentLocation = incidentLocation; }
    public void setIncidentDate(LocalDateTime incidentDate) { this.incidentDate = incidentDate; }
    public void setSuspectDescription(String suspectDescription) { this.suspectDescription = suspectDescription; }
    public void setStatus(ReportStatus status) { this.status = status; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    public void setAssignedOfficer(User assignedOfficer) { this.assignedOfficer = assignedOfficer; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }
    public void setOfficerNotes(String officerNotes) { this.officerNotes = officerNotes; }
    public void setCaseNumber(String caseNumber) { this.caseNumber = caseNumber; }
    public void setIsUrgent(Boolean isUrgent) { this.isUrgent = isUrgent; }
}
