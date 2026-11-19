package et.gov.police.dto;

import java.time.LocalDateTime;

public class NominationRequest {
    private String nominatorName;
    private String nominatorPhone;
    private String nominatorEmail;
    private String officerName;
    private String officerBadgeNumber;
    private String department;
    private String category;
    private String reason;
    private LocalDateTime incidentDate;
    private String incidentLocation;

    public String getNominatorName() { return nominatorName; }
    public void setNominatorName(String nominatorName) { this.nominatorName = nominatorName; }
    
    public String getNominatorPhone() { return nominatorPhone; }
    public void setNominatorPhone(String nominatorPhone) { this.nominatorPhone = nominatorPhone; }
    
    public String getNominatorEmail() { return nominatorEmail; }
    public void setNominatorEmail(String nominatorEmail) { this.nominatorEmail = nominatorEmail; }
    
    public String getOfficerName() { return officerName; }
    public void setOfficerName(String officerName) { this.officerName = officerName; }
    
    public String getOfficerBadgeNumber() { return officerBadgeNumber; }
    public void setOfficerBadgeNumber(String officerBadgeNumber) { this.officerBadgeNumber = officerBadgeNumber; }
    
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    
    public LocalDateTime getIncidentDate() { return incidentDate; }
    public void setIncidentDate(LocalDateTime incidentDate) { this.incidentDate = incidentDate; }
    
    public String getIncidentLocation() { return incidentLocation; }
    public void setIncidentLocation(String incidentLocation) { this.incidentLocation = incidentLocation; }
}
