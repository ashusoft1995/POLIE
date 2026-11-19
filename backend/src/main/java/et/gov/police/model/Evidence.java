package et.gov.police.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "evidences")
public class Evidence {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String evidenceNumber;
    
    @ManyToOne
    @JoinColumn(name = "case_id", nullable = false)
    private Case caseEntity;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private EvidenceType type;
    
    @Column(nullable = false)
    private String description;
    
    @Column(nullable = false)
    private String collectedLocation;
    
    @Column(nullable = false)
    private LocalDateTime collectedDate;
    
    @ManyToOne
    @JoinColumn(name = "collected_by_id", nullable = false)
    private User collectedBy;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ChainOfCustody custody = ChainOfCustody.COLLECTED;
    
    private String storageLocation;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    private String filePath;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime analyzedAt;
    
    @Column(columnDefinition = "TEXT")
    private String analysisResult;
    
    public enum EvidenceType {
        PHYSICAL,
        DIGITAL,
        DOCUMENT,
        PHOTOGRAPH,
        VIDEO,
        AUDIO,
        FORENSIC,
        WITNESS_STATEMENT,
        OTHER
    }
    
    public enum ChainOfCustody {
        COLLECTED,
        IN_STORAGE,
        IN_ANALYSIS,
        IN_COURT,
        RETURNED,
        DESTROYED
    }
    
    // Constructors
    public Evidence() {}
    
    // Getters
    public Long getId() { return id; }
    public String getEvidenceNumber() { return evidenceNumber; }
    public Case getCaseEntity() { return caseEntity; }
    public EvidenceType getType() { return type; }
    public String getDescription() { return description; }
    public String getCollectedLocation() { return collectedLocation; }
    public LocalDateTime getCollectedDate() { return collectedDate; }
    public User getCollectedBy() { return collectedBy; }
    public ChainOfCustody getCustody() { return custody; }
    public String getStorageLocation() { return storageLocation; }
    public String getNotes() { return notes; }
    public String getFilePath() { return filePath; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getAnalyzedAt() { return analyzedAt; }
    public String getAnalysisResult() { return analysisResult; }
    
    // Setters
    public void setId(Long id) { this.id = id; }
    public void setEvidenceNumber(String evidenceNumber) { this.evidenceNumber = evidenceNumber; }
    public void setCaseEntity(Case caseEntity) { this.caseEntity = caseEntity; }
    public void setType(EvidenceType type) { this.type = type; }
    public void setDescription(String description) { this.description = description; }
    public void setCollectedLocation(String collectedLocation) { this.collectedLocation = collectedLocation; }
    public void setCollectedDate(LocalDateTime collectedDate) { this.collectedDate = collectedDate; }
    public void setCollectedBy(User collectedBy) { this.collectedBy = collectedBy; }
    public void setCustody(ChainOfCustody custody) { this.custody = custody; }
    public void setStorageLocation(String storageLocation) { this.storageLocation = storageLocation; }
    public void setNotes(String notes) { this.notes = notes; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setAnalyzedAt(LocalDateTime analyzedAt) { this.analyzedAt = analyzedAt; }
    public void setAnalysisResult(String analysisResult) { this.analysisResult = analysisResult; }
}
