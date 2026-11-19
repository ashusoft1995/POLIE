package et.gov.police.dto;

import java.time.LocalDateTime;

public class EvidenceRequest {
    private Long caseId;
    private String type;
    private String description;
    private String collectedLocation;
    private LocalDateTime collectedDate;
    private String storageLocation;
    private String notes;
    private String filePath;

    public Long getCaseId() { return caseId; }
    public void setCaseId(Long caseId) { this.caseId = caseId; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getCollectedLocation() { return collectedLocation; }
    public void setCollectedLocation(String collectedLocation) { this.collectedLocation = collectedLocation; }
    
    public LocalDateTime getCollectedDate() { return collectedDate; }
    public void setCollectedDate(LocalDateTime collectedDate) { this.collectedDate = collectedDate; }
    
    public String getStorageLocation() { return storageLocation; }
    public void setStorageLocation(String storageLocation) { this.storageLocation = storageLocation; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
}
