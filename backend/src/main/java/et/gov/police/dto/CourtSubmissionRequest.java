package et.gov.police.dto;

public class CourtSubmissionRequest {
    private String courtSubmissionReceipt; // Receipt number from court
    private String submittedByOfficerName;
    private String submittedByOfficerBadge;
    private String courtName; // e.g., "Hossana City Court"
    
    // Constructors
    public CourtSubmissionRequest() {}
    
    // Getters and Setters
    public String getCourtSubmissionReceipt() { return courtSubmissionReceipt; }
    public void setCourtSubmissionReceipt(String courtSubmissionReceipt) { 
        this.courtSubmissionReceipt = courtSubmissionReceipt; 
    }
    
    public String getSubmittedByOfficerName() { return submittedByOfficerName; }
    public void setSubmittedByOfficerName(String submittedByOfficerName) { 
        this.submittedByOfficerName = submittedByOfficerName; 
    }
    
    public String getSubmittedByOfficerBadge() { return submittedByOfficerBadge; }
    public void setSubmittedByOfficerBadge(String submittedByOfficerBadge) { 
        this.submittedByOfficerBadge = submittedByOfficerBadge; 
    }
    
    public String getCourtName() { return courtName; }
    public void setCourtName(String courtName) { this.courtName = courtName; }
}
