package et.gov.police.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "traffic_reports")
public class TrafficReport {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String reporterName;
    
    @Column(nullable = false)
    private String reporterPhone;
    
    private String reporterEmail;
    
    @Column(nullable = false)
    private String incidentType;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private String location;
    
    @Column(nullable = false)
    private LocalDateTime incidentDate;
    
    private String vehiclePlateNumber;
    
    private String vehicleType;
    
    private String vehicleColor;
    
    private Integer injuredCount = 0;
    
    private Integer fatalitiesCount = 0;
    
    private Boolean policeNotified = false;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ReportStatus status = ReportStatus.PENDING;
    
    @Column(nullable = false)
    private LocalDateTime submittedAt = LocalDateTime.now();
    
    @ManyToOne
    @JoinColumn(name = "assigned_to")
    private User assignedOfficer;
    
    private LocalDateTime assignedAt;
    
    @Column(columnDefinition = "TEXT")
    private String officerNotes;
    
    private String reportNumber;
    
    public enum ReportStatus {
        PENDING,
        UNDER_REVIEW,
        ASSIGNED,
        INVESTIGATING,
        RESOLVED,
        CLOSED
    }
    
    // Constructors
    public TrafficReport() {}
    
    // Getters
    public Long getId() { return id; }
    public String getReporterName() { return reporterName; }
    public String getReporterPhone() { return reporterPhone; }
    public String getReporterEmail() { return reporterEmail; }
    public String getIncidentType() { return incidentType; }
    public String getDescription() { return description; }
    public String getLocation() { return location; }
    public LocalDateTime getIncidentDate() { return incidentDate; }
    public String getVehiclePlateNumber() { return vehiclePlateNumber; }
    public String getVehicleType() { return vehicleType; }
    public String getVehicleColor() { return vehicleColor; }
    public Integer getInjuredCount() { return injuredCount; }
    public Integer getFatalitiesCount() { return fatalitiesCount; }
    public Boolean getPoliceNotified() { return policeNotified; }
    public ReportStatus getStatus() { return status; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public User getAssignedOfficer() { return assignedOfficer; }
    public LocalDateTime getAssignedAt() { return assignedAt; }
    public String getOfficerNotes() { return officerNotes; }
    public String getReportNumber() { return reportNumber; }
    
    // Setters
    public void setId(Long id) { this.id = id; }
    public void setReporterName(String reporterName) { this.reporterName = reporterName; }
    public void setReporterPhone(String reporterPhone) { this.reporterPhone = reporterPhone; }
    public void setReporterEmail(String reporterEmail) { this.reporterEmail = reporterEmail; }
    public void setIncidentType(String incidentType) { this.incidentType = incidentType; }
    public void setDescription(String description) { this.description = description; }
    public void setLocation(String location) { this.location = location; }
    public void setIncidentDate(LocalDateTime incidentDate) { this.incidentDate = incidentDate; }
    public void setVehiclePlateNumber(String vehiclePlateNumber) { this.vehiclePlateNumber = vehiclePlateNumber; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }
    public void setVehicleColor(String vehicleColor) { this.vehicleColor = vehicleColor; }
    public void setInjuredCount(Integer injuredCount) { this.injuredCount = injuredCount; }
    public void setFatalitiesCount(Integer fatalitiesCount) { this.fatalitiesCount = fatalitiesCount; }
    public void setPoliceNotified(Boolean policeNotified) { this.policeNotified = policeNotified; }
    public void setStatus(ReportStatus status) { this.status = status; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    public void setAssignedOfficer(User assignedOfficer) { this.assignedOfficer = assignedOfficer; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }
    public void setOfficerNotes(String officerNotes) { this.officerNotes = officerNotes; }
    public void setReportNumber(String reportNumber) { this.reportNumber = reportNumber; }
}
