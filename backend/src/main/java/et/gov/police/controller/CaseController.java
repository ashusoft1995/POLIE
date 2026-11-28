package et.gov.police.controller;

import et.gov.police.dto.ApiResponse;
import et.gov.police.dto.CaseRequest;
import et.gov.police.model.Case;
import et.gov.police.model.User;
import et.gov.police.security.UserDetailsServiceImpl;
import et.gov.police.service.CaseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cases")
@CrossOrigin(origins = "*")
public class CaseController {
    
    private final CaseService caseService;
    
    public CaseController(CaseService caseService) {
        this.caseService = caseService;
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<Case>> createCase(
            @RequestBody CaseRequest request,
            Authentication authentication) {
        try {
            User user = ((UserDetailsServiceImpl.UserDetailsImpl) authentication.getPrincipal()).getUser();
            Case caseEntity = caseService.createCase(request, user.getId());
            return ResponseEntity.ok(new ApiResponse<>(true, "Case created successfully", caseEntity));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<Case>>> getAllCases() {
        List<Case> cases = caseService.getAllCases();
        return ResponseEntity.ok(new ApiResponse<>(true, "Cases retrieved successfully", cases));
    }
    
    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<Case>> getCaseById(@PathVariable Long id) {
        try {
            Case caseEntity = caseService.getCaseById(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Case retrieved successfully", caseEntity));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/number/{caseNumber}")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<Case>> getCaseByCaseNumber(@PathVariable String caseNumber) {
        try {
            Case caseEntity = caseService.getCaseByCaseNumber(caseNumber);
            return ResponseEntity.ok(new ApiResponse<>(true, "Case retrieved successfully", caseEntity));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/detective/{detectiveId}")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<Case>>> getCasesByDetective(@PathVariable Long detectiveId) {
        List<Case> cases = caseService.getCasesByDetective(detectiveId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Cases retrieved successfully", cases));
    }
    
    @GetMapping("/status/{status}")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<Case>>> getCasesByStatus(@PathVariable String status) {
        List<Case> cases = caseService.getCasesByStatus(
                Case.CaseStatus.valueOf(status.toUpperCase()));
        return ResponseEntity.ok(new ApiResponse<>(true, "Cases retrieved successfully", cases));
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Case>> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            Case caseEntity = caseService.updateCaseStatus(
                    id, Case.CaseStatus.valueOf(status.toUpperCase()));
            return ResponseEntity.ok(new ApiResponse<>(true, "Status updated successfully", caseEntity));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @PutMapping("/{id}/notes")
    public ResponseEntity<ApiResponse<Case>> updateNotes(
            @PathVariable Long id,
            @RequestBody String notes) {
        try {
            Case caseEntity = caseService.updateInvestigationNotes(id, notes);
            return ResponseEntity.ok(new ApiResponse<>(true, "Notes updated successfully", caseEntity));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @PostMapping("/{id}/close")
    public ResponseEntity<ApiResponse<Case>> closeCase(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestBody String closureNotes) {
        try {
            Case caseEntity = caseService.closeCase(
                    id, Case.CaseStatus.valueOf(status.toUpperCase()), closureNotes);
            return ResponseEntity.ok(new ApiResponse<>(true, "Case closed successfully", caseEntity));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping("/stats/count/{status}")
    public ResponseEntity<ApiResponse<Long>> countByStatus(@PathVariable String status) {
        Long count = caseService.countByStatus(Case.CaseStatus.valueOf(status.toUpperCase()));
        return ResponseEntity.ok(new ApiResponse<>(true, "Count retrieved successfully", count));
    }
}
