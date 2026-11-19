package et.gov.police.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "nominations")
public class Nomination {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nominatorName;
    
    @Column(nullable = false)
    private String nominatorPhone;
    
    private String nominatorEmail;
    
    @Column(nullable = false)
    private String officerName;
    
    private String officerBadgeNumber;
    
    @Column(nullable = false)
    private String department;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private NominationCategory category;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String reason;
    
    @Column(nullable = false)
    private LocalDateTime incidentDate;
    
    private String incidentLocation;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private NominationStatus status = NominationStatus.PENDING;
    
    @Column(nullable = false)
    private LocalDateTime submittedAt = LocalDateTime.now();
    
    @ManyToOne
    @JoinColumn(name = "reviewed_by_id")
    private User reviewedBy;
    
    private LocalDateTime reviewedAt;
    
    @Column(columnDefinition = "TEXT")
    private String reviewNotes;
    
    private String nominationNumber;
    
    public enum NominationCategory {
        BRAVERY,
        PROFESSIONALISM,
        COMMUNITY_SERVICE,
        EXCEPTIONAL_DUTY,
        LIFE_SAVING,
        OTHER
    }
    
    public enum NominationStatus {
        PENDING,
        UNDER_REVIEW,
        APPROVED,
        AWARDED,
        REJECTED
    }
    
    // Constructors
    public Nomination() {}
    
    // Getters
    public Long getId() { return id; }
    public String getNominatorName() { return nominatorName; }
    public String getNominatorPhone() { return nominatorPhone; }
    public String getNominatorEmail() { return nominatorEmail; }
    public String getOfficerName() { return officerName; }
    public String getOfficerBadgeNumber() { return officerBadgeNumber; }
    public String getDepartment() { return department; }
    public NominationCategory getCategory() { return category; }
    public String getReason() { return reason; }
    public LocalDateTime getIncidentDate() { return incidentDate; }
    public String getIncidentLocation() { return incidentLocation; }
    public NominationStatus getStatus() { return status; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public User getReviewedBy() { return reviewedBy; }
    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public String getReviewNotes() { return reviewNotes; }
    public String getNominationNumber() { return nominationNumber; }
    
    // Setters
    public void setId(Long id) { this.id = id; }
    public void setNominatorName(String nominatorName) { this.nominatorName = nominatorName; }
    public void setNominatorPhone(String nominatorPhone) { this.nominatorPhone = nominatorPhone; }
    public void setNominatorEmail(String nominatorEmail) { this.nominatorEmail = nominatorEmail; }
    public void setOfficerName(String officerName) { this.officerName = officerName; }
    public void setOfficerBadgeNumber(String officerBadgeNumber) { this.officerBadgeNumber = officerBadgeNumber; }
    public void setDepartment(String department) { this.department = department; }
    public void setCategory(NominationCategory category) { this.category = category; }
    public void setReason(String reason) { this.reason = reason; }
    public void setIncidentDate(LocalDateTime incidentDate) { this.incidentDate = incidentDate; }
    public void setIncidentLocation(String incidentLocation) { this.incidentLocation = incidentLocation; }
    public void setStatus(NominationStatus status) { this.status = status; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    public void setReviewedBy(User reviewedBy) { this.reviewedBy = reviewedBy; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }
    public void setReviewNotes(String reviewNotes) { this.reviewNotes = reviewNotes; }
    public void setNominationNumber(String nominationNumber) { this.nominationNumber = nominationNumber; }
}
