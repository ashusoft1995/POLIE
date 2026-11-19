package et.gov.police.dto;

import java.time.LocalDateTime;

public class CrimeReportRequest {
    private String reporterName;
    private String reporterPhone;
    private String reporterEmail;
    private String reporterAddress;
    private String crimeType;
    private String description;
    private String incidentLocation;
    private LocalDateTime incidentDate;
    private String suspectDescription;
    private Boolean isUrgent;

    public String getReporterName() { return reporterName; }
    public void setReporterName(String reporterName) { this.reporterName = reporterName; }
    
    public String getReporterPhone() { return reporterPhone; }
    public void setReporterPhone(String reporterPhone) { this.reporterPhone = reporterPhone; }
    
    public String getReporterEmail() { return reporterEmail; }
    public void setReporterEmail(String reporterEmail) { this.reporterEmail = reporterEmail; }
    
    public String getReporterAddress() { return reporterAddress; }
    public void setReporterAddress(String reporterAddress) { this.reporterAddress = reporterAddress; }
    
    public String getCrimeType() { return crimeType; }
    public void setCrimeType(String crimeType) { this.crimeType = crimeType; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getIncidentLocation() { return incidentLocation; }
    public void setIncidentLocation(String incidentLocation) { this.incidentLocation = incidentLocation; }
    
    public LocalDateTime getIncidentDate() { return incidentDate; }
    public void setIncidentDate(LocalDateTime incidentDate) { this.incidentDate = incidentDate; }
    
    public String getSuspectDescription() { return suspectDescription; }
    public void setSuspectDescription(String suspectDescription) { this.suspectDescription = suspectDescription; }
    
    public Boolean getIsUrgent() { return isUrgent; }
    public void setIsUrgent(Boolean isUrgent) { this.isUrgent = isUrgent; }
}
