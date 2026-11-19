package et.gov.police.dto;

import java.time.LocalDateTime;

public class MissingPersonRequest {
    private String reporterName;
    private String reporterPhone;
    private String reporterEmail;
    private String reporterRelationship;
    private String missingPersonName;
    private Integer missingPersonAge;
    private String gender;
    private Double height;
    private Double weight;
    private String physicalDescription;
    private String lastSeenWearing;
    private String lastSeenLocation;
    private LocalDateTime lastSeenDate;
    private String circumstances;
    private String medicalConditions;
    private Boolean isCritical;

    public String getReporterName() { return reporterName; }
    public void setReporterName(String reporterName) { this.reporterName = reporterName; }
    
    public String getReporterPhone() { return reporterPhone; }
    public void setReporterPhone(String reporterPhone) { this.reporterPhone = reporterPhone; }
    
    public String getReporterEmail() { return reporterEmail; }
    public void setReporterEmail(String reporterEmail) { this.reporterEmail = reporterEmail; }
    
    public String getReporterRelationship() { return reporterRelationship; }
    public void setReporterRelationship(String reporterRelationship) { this.reporterRelationship = reporterRelationship; }
    
    public String getMissingPersonName() { return missingPersonName; }
    public void setMissingPersonName(String missingPersonName) { this.missingPersonName = missingPersonName; }
    
    public Integer getMissingPersonAge() { return missingPersonAge; }
    public void setMissingPersonAge(Integer missingPersonAge) { this.missingPersonAge = missingPersonAge; }
    
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    
    public Double getHeight() { return height; }
    public void setHeight(Double height) { this.height = height; }
    
    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }
    
    public String getPhysicalDescription() { return physicalDescription; }
    public void setPhysicalDescription(String physicalDescription) { this.physicalDescription = physicalDescription; }
    
    public String getLastSeenWearing() { return lastSeenWearing; }
    public void setLastSeenWearing(String lastSeenWearing) { this.lastSeenWearing = lastSeenWearing; }
    
    public String getLastSeenLocation() { return lastSeenLocation; }
    public void setLastSeenLocation(String lastSeenLocation) { this.lastSeenLocation = lastSeenLocation; }
    
    public LocalDateTime getLastSeenDate() { return lastSeenDate; }
    public void setLastSeenDate(LocalDateTime lastSeenDate) { this.lastSeenDate = lastSeenDate; }
    
    public String getCircumstances() { return circumstances; }
    public void setCircumstances(String circumstances) { this.circumstances = circumstances; }
    
    public String getMedicalConditions() { return medicalConditions; }
    public void setMedicalConditions(String medicalConditions) { this.medicalConditions = medicalConditions; }
    
    public Boolean getIsCritical() { return isCritical; }
    public void setIsCritical(Boolean isCritical) { this.isCritical = isCritical; }
}
