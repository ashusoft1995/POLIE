package et.gov.police.dto;

import java.time.LocalDateTime;

public class CaseRequest {
    private String title;
    private String caseType;
    private String description;
    private String priority;
    private Long assignedDetectiveId;
    private String location;
    private LocalDateTime incidentDate;
    private Long crimeReportId;
    private Long missingPersonId;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getCaseType() { return caseType; }
    public void setCaseType(String caseType) { this.caseType = caseType; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    
    public Long getAssignedDetectiveId() { return assignedDetectiveId; }
    public void setAssignedDetectiveId(Long assignedDetectiveId) { this.assignedDetectiveId = assignedDetectiveId; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public LocalDateTime getIncidentDate() { return incidentDate; }
    public void setIncidentDate(LocalDateTime incidentDate) { this.incidentDate = incidentDate; }
    
    public Long getCrimeReportId() { return crimeReportId; }
    public void setCrimeReportId(Long crimeReportId) { this.crimeReportId = crimeReportId; }
    
    public Long getMissingPersonId() { return missingPersonId; }
    public void setMissingPersonId(Long missingPersonId) { this.missingPersonId = missingPersonId; }
}
