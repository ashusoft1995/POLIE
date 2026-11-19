package et.gov.police.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cases")
public class Case {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String caseNumber;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private CaseType caseType;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private CaseStatus status = CaseStatus.OPEN;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private CasePriority priority = CasePriority.MEDIUM;
    
    @ManyToOne
    @JoinColumn(name = "assigned_detective_id", nullable = false)
    private User assignedDetective;
    
    @ManyToOne
    @JoinColumn(name = "created_by_id")
    private User createdBy;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime assignedAt;
    
    private LocalDateTime closedAt;
    
    @Column(columnDefinition = "TEXT")
    private String investigationNotes;
    
    @Column(columnDefinition = "TEXT")
    private String closureNotes;
    
    @OneToMany(mappedBy = "caseEntity", cascade = CascadeType.ALL)
    private List<Evidence> evidences = new ArrayList<>();
    
    private String location;
    
    private LocalDateTime incidentDate;
    
    @OneToOne
    @JoinColumn(name = "crime_report_id")
    private CrimeReport relatedCrimeReport;
    
    @OneToOne
    @JoinColumn(name = "missing_person_id")
    private MissingPerson relatedMissingPerson;
    
    public enum CaseType {
        THEFT,
        ASSAULT,
        FRAUD,
        BURGLARY,
        HOMICIDE,
        DRUG_OFFENSE,
        CYBERCRIME,
        MISSING_PERSON,
        DOMESTIC_VIOLENCE,
        OTHER
    }
    
    public enum CaseStatus {
        OPEN,
        UNDER_INVESTIGATION,
        PENDING_EVIDENCE,
        PENDING_COURT,
        CLOSED_SOLVED,
        CLOSED_UNSOLVED,
        SUSPENDED
    }
    
    public enum CasePriority {
        LOW,
        MEDIUM,
        HIGH,
        CRITICAL
    }
    
    // Constructors
    public Case() {}
    
    // Getters
    public Long getId() { return id; }
    public String getCaseNumber() { return caseNumber; }
    public String getTitle() { return title; }
    public CaseType getCaseType() { return caseType; }
    public String getDescription() { return description; }
    public CaseStatus getStatus() { return status; }
    public CasePriority getPriority() { return priority; }
    public User getAssignedDetective() { return assignedDetective; }
    public User getCreatedBy() { return createdBy; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getAssignedAt() { return assignedAt; }
    public LocalDateTime getClosedAt() { return closedAt; }
    public String getInvestigationNotes() { return investigationNotes; }
    public String getClosureNotes() { return closureNotes; }
    public List<Evidence> getEvidences() { return evidences; }
    public String getLocation() { return location; }
    public LocalDateTime getIncidentDate() { return incidentDate; }
    public CrimeReport getRelatedCrimeReport() { return relatedCrimeReport; }
    public MissingPerson getRelatedMissingPerson() { return relatedMissingPerson; }
    
    // Setters
    public void setId(Long id) { this.id = id; }
    public void setCaseNumber(String caseNumber) { this.caseNumber = caseNumber; }
    public void setTitle(String title) { this.title = title; }
    public void setCaseType(CaseType caseType) { this.caseType = caseType; }
    public void setDescription(String description) { this.description = description; }
    public void setStatus(CaseStatus status) { this.status = status; }
    public void setPriority(CasePriority priority) { this.priority = priority; }
    public void setAssignedDetective(User assignedDetective) { this.assignedDetective = assignedDetective; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }
    public void setClosedAt(LocalDateTime closedAt) { this.closedAt = closedAt; }
    public void setInvestigationNotes(String investigationNotes) { this.investigationNotes = investigationNotes; }
    public void setClosureNotes(String closureNotes) { this.closureNotes = closureNotes; }
    public void setEvidences(List<Evidence> evidences) { this.evidences = evidences; }
    public void setLocation(String location) { this.location = location; }
    public void setIncidentDate(LocalDateTime incidentDate) { this.incidentDate = incidentDate; }
    public void setRelatedCrimeReport(CrimeReport relatedCrimeReport) { this.relatedCrimeReport = relatedCrimeReport; }
    public void setRelatedMissingPerson(MissingPerson relatedMissingPerson) { this.relatedMissingPerson = relatedMissingPerson; }
}
