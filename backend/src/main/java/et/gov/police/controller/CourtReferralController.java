package et.gov.police.controller;

import et.gov.police.dto.ApiResponse;
import et.gov.police.dto.ApproveReferralRequest;
import et.gov.police.dto.CourtReferralRequest;
import et.gov.police.dto.CourtSubmissionRequest;
import et.gov.police.model.CourtReferral;
import et.gov.police.model.CourtReferral.ReferralStatus;
import et.gov.police.service.CourtReferralService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/court-referrals")
@CrossOrigin(origins = "*")
public class CourtReferralController {
    
    private final CourtReferralService courtReferralService;
    
    public CourtReferralController(CourtReferralService courtReferralService) {
        this.courtReferralService = courtReferralService;
    }
    
    @PostMapping
    @PreAuthorize("hasRole('DETECTIVE')")
    public ResponseEntity<ApiResponse<CourtReferral>> submitReferral(
        @RequestBody CourtReferralRequest request,
        @RequestParam Long detectiveId
    ) {
        try {
            CourtReferral referral = courtReferralService.submitReferral(request, detectiveId);
            return ResponseEntity.ok(ApiResponse.success(
                "Court referral submitted successfully",
                referral
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                ApiResponse.error("Failed to submit referral: " + e.getMessage())
            );
        }
    }
    
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('POLICE_HEAD')")
    public ResponseEntity<ApiResponse<CourtReferral>> approveReferral(
        @PathVariable Long id,
        @RequestBody ApproveReferralRequest request,
        @RequestParam Long headId
    ) {
        try {
            CourtReferral referral = courtReferralService.approveReferral(id, request, headId);
            return ResponseEntity.ok(ApiResponse.success(
                request.isApproved() ? "Referral approved" : "Referral rejected",
                referral
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                ApiResponse.error("Failed to process referral: " + e.getMessage())
            );
        }
    }
    
    @PutMapping("/{id}/submit-to-court")
    @PreAuthorize("hasAnyRole('POLICE_HEAD', 'DETECTIVE')")
    public ResponseEntity<ApiResponse<CourtReferral>> recordCourtSubmission(
        @PathVariable Long id,
        @RequestBody CourtSubmissionRequest request
    ) {
        try {
            CourtReferral referral = courtReferralService.recordCourtSubmission(id, request);
            return ResponseEntity.ok(ApiResponse.success(
                "Court submission recorded successfully",
                referral
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                ApiResponse.error("Failed to record submission: " + e.getMessage())
            );
        }
    }
    
    @GetMapping
    @PreAuthorize("hasAnyRole('POLICE_HEAD', 'DETECTIVE')")
    public ResponseEntity<ApiResponse<List<CourtReferral>>> getAllReferrals() {
        try {
            List<CourtReferral> referrals = courtReferralService.getAllReferrals();
            return ResponseEntity.ok(ApiResponse.success("Referrals retrieved", referrals));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                ApiResponse.error("Failed to retrieve referrals: " + e.getMessage())
            );
        }
    }
    
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('POLICE_HEAD', 'DETECTIVE')")
    public ResponseEntity<ApiResponse<List<CourtReferral>>> getReferralsByStatus(
        @PathVariable ReferralStatus status
    ) {
        try {
            List<CourtReferral> referrals = courtReferralService.getReferralsByStatus(status);
            return ResponseEntity.ok(ApiResponse.success("Referrals retrieved", referrals));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                ApiResponse.error("Failed to retrieve referrals: " + e.getMessage())
            );
        }
    }
    
    @GetMapping("/detective/{detectiveId}")
    @PreAuthorize("hasAnyRole('POLICE_HEAD', 'DETECTIVE')")
    public ResponseEntity<ApiResponse<List<CourtReferral>>> getReferralsByDetective(
        @PathVariable Long detectiveId
    ) {
        try {
            List<CourtReferral> referrals = courtReferralService.getReferralsByDetective(detectiveId);
            return ResponseEntity.ok(ApiResponse.success("Referrals retrieved", referrals));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                ApiResponse.error("Failed to retrieve referrals: " + e.getMessage())
            );
        }
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('POLICE_HEAD', 'DETECTIVE')")
    public ResponseEntity<ApiResponse<CourtReferral>> getReferralById(@PathVariable Long id) {
        try {
            CourtReferral referral = courtReferralService.getReferralById(id);
            return ResponseEntity.ok(ApiResponse.success("Referral retrieved", referral));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                ApiResponse.error("Failed to retrieve referral: " + e.getMessage())
            );
        }
    }
}
