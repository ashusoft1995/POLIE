package et.gov.police.dto;

import java.time.LocalDateTime;

public class TrafficReportRequest {
    private String reporterName;
    private String reporterPhone;
    private String reporterEmail;
    private String incidentType;
    private String description;
    private String location;
    private LocalDateTime incidentDate;
    private String vehiclePlateNumber;
    private String vehicleType;
    private String vehicleColor;
    private Integer injuredCount;
    private Integer fatalitiesCount;
    private Boolean policeNotified;

    public String getReporterName() { return reporterName; }
    public void setReporterName(String reporterName) { this.reporterName = reporterName; }
    
    public String getReporterPhone() { return reporterPhone; }
    public void setReporterPhone(String reporterPhone) { this.reporterPhone = reporterPhone; }
    
    public String getReporterEmail() { return reporterEmail; }
    public void setReporterEmail(String reporterEmail) { this.reporterEmail = reporterEmail; }
    
    public String getIncidentType() { return incidentType; }
    public void setIncidentType(String incidentType) { this.incidentType = incidentType; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public LocalDateTime getIncidentDate() { return incidentDate; }
    public void setIncidentDate(LocalDateTime incidentDate) { this.incidentDate = incidentDate; }
    
    public String getVehiclePlateNumber() { return vehiclePlateNumber; }
    public void setVehiclePlateNumber(String vehiclePlateNumber) { this.vehiclePlateNumber = vehiclePlateNumber; }
    
    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }
    
    public String getVehicleColor() { return vehicleColor; }
    public void setVehicleColor(String vehicleColor) { this.vehicleColor = vehicleColor; }
    
    public Integer getInjuredCount() { return injuredCount; }
    public void setInjuredCount(Integer injuredCount) { this.injuredCount = injuredCount; }
    
    public Integer getFatalitiesCount() { return fatalitiesCount; }
    public void setFatalitiesCount(Integer fatalitiesCount) { this.fatalitiesCount = fatalitiesCount; }
    
    public Boolean getPoliceNotified() { return policeNotified; }
    public void setPoliceNotified(Boolean policeNotified) { this.policeNotified = policeNotified; }
}
