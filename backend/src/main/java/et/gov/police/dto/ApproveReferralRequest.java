package et.gov.police.dto;

public class ApproveReferralRequest {
    private String headRemarks;
    private boolean approved; // true = approve, false = reject
    private String rejectionReason; // only if approved = false
    
    // Constructors
    public ApproveReferralRequest() {}
    
    // Getters and Setters
    public String getHeadRemarks() { return headRemarks; }
    public void setHeadRemarks(String headRemarks) { this.headRemarks = headRemarks; }
    
    public boolean isApproved() { return approved; }
    public void setApproved(boolean approved) { this.approved = approved; }
    
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { 
        this.rejectionReason = rejectionReason; 
    }
}
