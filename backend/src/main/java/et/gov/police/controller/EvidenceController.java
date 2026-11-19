package et.gov.police.controller;

import et.gov.police.dto.ApiResponse;
import et.gov.police.dto.EvidenceRequest;
import et.gov.police.model.Evidence;
import et.gov.police.model.User;
import et.gov.police.security.UserDetailsServiceImpl;
import et.gov.police.service.EvidenceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evidence")
@CrossOrigin(origins = "*")
public class EvidenceController {
    
    private final EvidenceService evidenceService;
    
    public EvidenceController(EvidenceService evidenceService) {
        this.evidenceService = evidenceService;
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<Evidence>> addEvidence(
            @RequestBody EvidenceRequest request,
            Authentication authentication) {
        try {
            User user = ((UserDetailsServiceImpl.UserDetailsImpl) authentication.getPrincipal()).getUser();
            Evidence evidence = evidenceService.addEvidence(request, user.getId());
            return ResponseEntity.ok(new ApiResponse<>(true, "Evidence added successfully", evidence));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping("/case/{caseId}")
    public ResponseEntity<ApiResponse<List<Evidence>>> getEvidenceByCase(@PathVariable Long caseId) {
        try {
            List<Evidence> evidence = evidenceService.getEvidenceByCase(caseId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Evidence retrieved successfully", evidence));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Evidence>> getEvidenceById(@PathVariable Long id) {
        try {
            Evidence evidence = evidenceService.getEvidenceById(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Evidence retrieved successfully", evidence));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}/custody")
    public ResponseEntity<ApiResponse<Evidence>> updateCustody(
            @PathVariable Long id,
            @RequestParam String custody) {
        try {
            Evidence evidence = evidenceService.updateCustody(
                    id, Evidence.ChainOfCustody.valueOf(custody.toUpperCase()));
            return ResponseEntity.ok(new ApiResponse<>(true, "Custody updated successfully", evidence));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @PostMapping("/{id}/analysis")
    public ResponseEntity<ApiResponse<Evidence>> addAnalysis(
            @PathVariable Long id,
            @RequestBody String analysisResult) {
        try {
            Evidence evidence = evidenceService.addAnalysis(id, analysisResult);
            return ResponseEntity.ok(new ApiResponse<>(true, "Analysis added successfully", evidence));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping("/case/{caseId}/count")
    public ResponseEntity<ApiResponse<Long>> countByCase(@PathVariable Long caseId) {
        try {
            Long count = evidenceService.countByCase(caseId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Count retrieved successfully", count));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}
