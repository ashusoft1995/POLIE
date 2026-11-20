package et.gov.police.service;

import et.gov.police.dto.ApproveReferralRequest;
import et.gov.police.dto.CourtReferralRequest;
import et.gov.police.dto.CourtSubmissionRequest;
import et.gov.police.model.Case;
import et.gov.police.model.CourtReferral;
import et.gov.police.model.CourtReferral.ReferralStatus;
import et.gov.police.model.User;
import et.gov.police.repository.CaseRepository;
import et.gov.police.repository.CourtReferralRepository;
import et.gov.police.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CourtReferralService {
    
    private final CourtReferralRepository courtReferralRepository;
    private final CaseRepository caseRepository;
    private final UserRepository userRepository;
    
    public CourtReferralService(
        CourtReferralRepository courtReferralRepository,
        CaseRepository caseRepository,
        UserRepository userRepository
    ) {
        this.courtReferralRepository = courtReferralRepository;
        this.caseRepository = caseRepository;
        this.userRepository = userRepository;
    }
    
    @Transactional
    public CourtReferral submitReferral(CourtReferralRequest request, Long detectiveId) {
        // Find case
        Case caseEntity = caseRepository.findById(request.getCaseId())
            .orElseThrow(() -> new RuntimeException("Case not found"));
        
        // Find detective
        User detective = userRepository.findById(detectiveId)
            .orElseThrow(() -> new RuntimeException("Detective not found"));
        
        // Generate referral number
        String referralNumber = generateReferralNumber();
        
        // Create referral
        CourtReferral referral = new CourtReferral();
        referral.setReferralNumber(referralNumber);
        referral.setCaseEntity(caseEntity);
        referral.setSubmittedByDetective(detective);
        referral.setInvestigationSummary(request.getInvestigationSummary());
        referral.setRecommendedCharges(request.getRecommendedCharges());
        referral.setWitnessDetails(request.getWitnessDetails());
        referral.setEvidenceSummary(request.getEvidenceSummary());
        referral.setStatus(ReferralStatus.PENDING_APPROVAL);
        referral.setSubmittedAt(LocalDateTime.now());
        
        // Update case status
        caseEntity.setStatus(Case.CaseStatus.PENDING_COURT);
        caseRepository.save(caseEntity);
        
        return courtReferralRepository.save(referral);
    }
    
    @Transactional
    public CourtReferral approveReferral(Long referralId, ApproveReferralRequest request, Long headId) {
        CourtReferral referral = courtReferralRepository.findById(referralId)
            .orElseThrow(() -> new RuntimeException("Referral not found"));
        
        User head = userRepository.findById(headId)
            .orElseThrow(() -> new RuntimeException("Police Head not found"));
        
        referral.setApprovedByHead(head);
        referral.setHeadRemarks(request.getHeadRemarks());
        referral.setApprovedAt(LocalDateTime.now());
        
        if (request.isApproved()) {
            referral.setStatus(ReferralStatus.APPROVED);
        } else {
            referral.setStatus(ReferralStatus.REJECTED);
            referral.setRejectionReason(request.getRejectionReason());
            referral.setRejectedAt(LocalDateTime.now());
            
            // Update case status back to under investigation
            Case caseEntity = referral.getCaseEntity();
            caseEntity.setStatus(Case.CaseStatus.UNDER_INVESTIGATION);
            caseRepository.save(caseEntity);
        }
        
        return courtReferralRepository.save(referral);
    }
    
    @Transactional
    public CourtReferral recordCourtSubmission(Long referralId, CourtSubmissionRequest request) {
        CourtReferral referral = courtReferralRepository.findById(referralId)
            .orElseThrow(() -> new RuntimeException("Referral not found"));
        
        if (referral.getStatus() != ReferralStatus.APPROVED) {
            throw new RuntimeException("Referral must be approved before submission to court");
        }
        
        referral.setStatus(ReferralStatus.SENT_TO_COURT);
        referral.setCourtSubmissionReceipt(request.getCourtSubmissionReceipt());
        referral.setSubmittedByOfficerName(request.getSubmittedByOfficerName());
        referral.setSubmittedByOfficerBadge(request.getSubmittedByOfficerBadge());
        referral.setCourtName(request.getCourtName());
        referral.setSentToCourtAt(LocalDateTime.now());
        
        return courtReferralRepository.save(referral);
    }
    
    public List<CourtReferral> getAllReferrals() {
        return courtReferralRepository.findAllOrderBySubmittedAtDesc();
    }
    
    public List<CourtReferral> getReferralsByStatus(ReferralStatus status) {
        return courtReferralRepository.findByStatus(status);
    }
    
    public List<CourtReferral> getReferralsByDetective(Long detectiveId) {
        return courtReferralRepository.findByDetectiveId(detectiveId);
    }
    
    public CourtReferral getReferralById(Long id) {
        return courtReferralRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Referral not found"));
    }
    
    private String generateReferralNumber() {
        String prefix = "REF-" + LocalDateTime.now().getYear() + "-";
        int counter = 1;
        String referralNumber;
        
        do {
            referralNumber = prefix + String.format("%06d", counter++);
        } while (courtReferralRepository.existsByReferralNumber(referralNumber));
        
        return referralNumber;
    }
}
