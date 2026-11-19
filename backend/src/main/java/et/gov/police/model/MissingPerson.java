package et.gov.police.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "missing_persons")
public class MissingPerson {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String reporterName;
    
    @Column(nullable = false)
    private String reporterPhone;
    
    private String reporterEmail;
    
    @Column(nullable = false)
    private String reporterRelationship;
    
    @Column(nullable = false)
    private String missingPersonName;
    
    @Column(nullable = false)
    private Integer missingPersonAge;
    
    @Column(nullable = false)
    private String gender;
    
    private Double height;
    
    private Double weight;
    
    @Column(columnDefinition = "TEXT")
    private String physicalDescription;
    
    @Column(columnDefinition = "TEXT")
    private String lastSeenWearing;
    
    @Column(nullable = false)
    private String lastSeenLocation;
    
    @Column(nullable = false)
    private LocalDateTime lastSeenDate;
    
    @Column(columnDefinition = "TEXT")
    private String circumstances;
    
    private String medicalConditions;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ReportStatus status = ReportStatus.ACTIVE;
    
    @Column(nullable = false)
    private LocalDateTime reportedAt = LocalDateTime.now();
    
    @ManyToOne
    @JoinColumn(name = "assigned_to")
    private User assignedOfficer;
    
    private LocalDateTime assignedAt;
    
    @Column(columnDefinition = "TEXT")
    private String investigationNotes;
    
    private String caseNumber;
    
    private Boolean isCritical = false;
    
    public enum ReportStatus {
        ACTIVE,
        UNDER_INVESTIGATION,
        FOUND_SAFE,
        FOUND_DECEASED,
        CLOSED
    }
    
    // Constructors
    public MissingPerson() {}
    
    // Getters
    public Long getId() { return id; }
    public String getReporterName() { return reporterName; }
    public String getReporterPhone() { return reporterPhone; }
    public String getReporterEmail() { return reporterEmail; }
    public String getReporterRelationship() { return reporterRelationship; }
    public String getMissingPersonName() { return missingPersonName; }
    public Integer getMissingPersonAge() { return missingPersonAge; }
    public String getGender() { return gender; }
    public Double getHeight() { return height; }
    public Double getWeight() { return weight; }
    public String getPhysicalDescription() { return physicalDescription; }
    public String getLastSeenWearing() { return lastSeenWearing; }
    public String getLastSeenLocation() { return lastSeenLocation; }
    public LocalDateTime getLastSeenDate() { return lastSeenDate; }
    public String getCircumstances() { return circumstances; }
    public String getMedicalConditions() { return medicalConditions; }
    public ReportStatus getStatus() { return status; }
    public LocalDateTime getReportedAt() { return reportedAt; }
    public User getAssignedOfficer() { return assignedOfficer; }
    public LocalDateTime getAssignedAt() { return assignedAt; }
    public String getInvestigationNotes() { return investigationNotes; }
    public String getCaseNumber() { return caseNumber; }
    public Boolean getIsCritical() { return isCritical; }
    
    // Setters
    public void setId(Long id) { this.id = id; }
    public void setReporterName(String reporterName) { this.reporterName = reporterName; }
    public void setReporterPhone(String reporterPhone) { this.reporterPhone = reporterPhone; }
    public void setReporterEmail(String reporterEmail) { this.reporterEmail = reporterEmail; }
    public void setReporterRelationship(String reporterRelationship) { this.reporterRelationship = reporterRelationship; }
    public void setMissingPersonName(String missingPersonName) { this.missingPersonName = missingPersonName; }
    public void setMissingPersonAge(Integer missingPersonAge) { this.missingPersonAge = missingPersonAge; }
    public void setGender(String gender) { this.gender = gender; }
    public void setHeight(Double height) { this.height = height; }
    public void setWeight(Double weight) { this.weight = weight; }
    public void setPhysicalDescription(String physicalDescription) { this.physicalDescription = physicalDescription; }
    public void setLastSeenWearing(String lastSeenWearing) { this.lastSeenWearing = lastSeenWearing; }
    public void setLastSeenLocation(String lastSeenLocation) { this.lastSeenLocation = lastSeenLocation; }
    public void setLastSeenDate(LocalDateTime lastSeenDate) { this.lastSeenDate = lastSeenDate; }
    public void setCircumstances(String circumstances) { this.circumstances = circumstances; }
    public void setMedicalConditions(String medicalConditions) { this.medicalConditions = medicalConditions; }
    public void setStatus(ReportStatus status) { this.status = status; }
    public void setReportedAt(LocalDateTime reportedAt) { this.reportedAt = reportedAt; }
    public void setAssignedOfficer(User assignedOfficer) { this.assignedOfficer = assignedOfficer; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }
    public void setInvestigationNotes(String investigationNotes) { this.investigationNotes = investigationNotes; }
    public void setCaseNumber(String caseNumber) { this.caseNumber = caseNumber; }
    public void setIsCritical(Boolean isCritical) { this.isCritical = isCritical; }
}
