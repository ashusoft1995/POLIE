package et.gov.police.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "court_referrals")
public class CourtReferral {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String referralNumber; // e.g., CR-2026-000001
    
    @OneToOne
    @JoinColumn(name = "case_id", nullable = false)
    private Case caseEntity;
    
    @ManyToOne
    @JoinColumn(name = "submitted_by_detective_id", nullable = false)
    private User submittedByDetective;
    
    @ManyToOne
    @JoinColumn(name = "approved_by_head_id")
    private User approvedByHead;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ReferralStatus status = ReferralStatus.PENDING_APPROVAL;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String investigationSummary;
    
    @Column(columnDefinition = "TEXT")
    private String recommendedCharges;
    
    @Column(columnDefinition = "TEXT")
    private String witnessDetails;
    
    @Column(columnDefinition = "TEXT")
    private String evidenceSummary;
    
    @Column(nullable = false)
    private LocalDateTime submittedAt = LocalDateTime.now();
    
    private LocalDateTime approvedAt;
    
    private LocalDateTime sentToCourtAt;
    
    @Column(columnDefinition = "TEXT")
    private String headRemarks;
    
    // Court submission tracking
    private String courtSubmissionReceipt; // Receipt number from court
    
    private String submittedByOfficerName; // Officer who physically submitted
    
    private String submittedByOfficerBadge;
    
    private String courtName; // e.g., "Hossana City Court"
    
    @Column(columnDefinition = "TEXT")
    private String rejectionReason;
    
    private LocalDateTime rejectedAt;
    
    public enum ReferralStatus {
        PENDING_APPROVAL,      // Waiting for Police Head approval
        APPROVED,              // Approved by Police Head
        SENT_TO_COURT,         // PDF generated and submitted to court
        REJECTED,              // Rejected by Police Head
        RETURNED_FOR_REVISION  // Needs more investigation
    }
    
    // Constructors
    public CourtReferral() {}
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getReferralNumber() { return referralNumber; }
    public void setReferralNumber(String referralNumber) { this.referralNumber = referralNumber; }
    
    public Case getCaseEntity() { return caseEntity; }
    public void setCaseEntity(Case caseEntity) { this.caseEntity = caseEntity; }
    
    public User getSubmittedByDetective() { return submittedByDetective; }
    public void setSubmittedByDetective(User submittedByDetective) { this.submittedByDetective = submittedByDetective; }
    
    public User getApprovedByHead() { return approvedByHead; }
    public void setApprovedByHead(User approvedByHead) { this.approvedByHead = approvedByHead; }
    
    public ReferralStatus getStatus() { return status; }
    public void setStatus(ReferralStatus status) { this.status = status; }
    
    public String getInvestigationSummary() { return investigationSummary; }
    public void setInvestigationSummary(String investigationSummary) { this.investigationSummary = investigationSummary; }
    
    public String getRecommendedCharges() { return recommendedCharges; }
    public void setRecommendedCharges(String recommendedCharges) { this.recommendedCharges = recommendedCharges; }
    
    public String getWitnessDetails() { return witnessDetails; }
    public void setWitnessDetails(String witnessDetails) { this.witnessDetails = witnessDetails; }
    
    public String getEvidenceSummary() { return evidenceSummary; }
    public void setEvidenceSummary(String evidenceSummary) { this.evidenceSummary = evidenceSummary; }
    
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    
    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }
    
    public LocalDateTime getSentToCourtAt() { return sentToCourtAt; }
    public void setSentToCourtAt(LocalDateTime sentToCourtAt) { this.sentToCourtAt = sentToCourtAt; }
    
    public String getHeadRemarks() { return headRemarks; }
    public void setHeadRemarks(String headRemarks) { this.headRemarks = headRemarks; }
    
    public String getCourtSubmissionReceipt() { return courtSubmissionReceipt; }
    public void setCourtSubmissionReceipt(String courtSubmissionReceipt) { this.courtSubmissionReceipt = courtSubmissionReceipt; }
    
    public String getSubmittedByOfficerName() { return submittedByOfficerName; }
    public void setSubmittedByOfficerName(String submittedByOfficerName) { this.submittedByOfficerName = submittedByOfficerName; }
    
    public String getSubmittedByOfficerBadge() { return submittedByOfficerBadge; }
    public void setSubmittedByOfficerBadge(String submittedByOfficerBadge) { this.submittedByOfficerBadge = submittedByOfficerBadge; }
    
    public String getCourtName() { return courtName; }
    public void setCourtName(String courtName) { this.courtName = courtName; }
    
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    
    public LocalDateTime getRejectedAt() { return rejectedAt; }
    public void setRejectedAt(LocalDateTime rejectedAt) { this.rejectedAt = rejectedAt; }
}
