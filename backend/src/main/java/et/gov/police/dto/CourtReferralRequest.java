package et.gov.police.dto;

public class CourtReferralRequest {
    private Long caseId;
    private String investigationSummary;
    private String recommendedCharges;
    private String witnessDetails;
    private String evidenceSummary;
    
    // Constructors
    public CourtReferralRequest() {}
    
    // Getters and Setters
    public Long getCaseId() { return caseId; }
    public void setCaseId(Long caseId) { this.caseId = caseId; }
    
    public String getInvestigationSummary() { return investigationSummary; }
    public void setInvestigationSummary(String investigationSummary) { 
        this.investigationSummary = investigationSummary; 
    }
    
    public String getRecommendedCharges() { return recommendedCharges; }
    public void setRecommendedCharges(String recommendedCharges) { 
        this.recommendedCharges = recommendedCharges; 
    }
    
    public String getWitnessDetails() { return witnessDetails; }
    public void setWitnessDetails(String witnessDetails) { 
        this.witnessDetails = witnessDetails; 
    }
    
    public String getEvidenceSummary() { return evidenceSummary; }
    public void setEvidenceSummary(String evidenceSummary) { 
        this.evidenceSummary = evidenceSummary; 
    }
}
