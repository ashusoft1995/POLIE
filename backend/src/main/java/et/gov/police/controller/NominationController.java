package et.gov.police.controller;

import et.gov.police.dto.ApiResponse;
import et.gov.police.dto.NominationRequest;
import et.gov.police.model.Nomination;
import et.gov.police.service.NominationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/nominations")
@CrossOrigin(origins = "*")
public class NominationController {
    
    private final NominationService nominationService;
    
    public NominationController(NominationService nominationService) {
        this.nominationService = nominationService;
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<Nomination>> submitNomination(@RequestBody NominationRequest request) {
        try {
            Nomination nomination = nominationService.submitNomination(request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Nomination submitted successfully", nomination));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Nomination>>> getAllNominations() {
        List<Nomination> nominations = nominationService.getAllNominations();
        return ResponseEntity.ok(new ApiResponse<>(true, "Nominations retrieved successfully", nominations));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Nomination>> getNominationById(@PathVariable Long id) {
        try {
            Nomination nomination = nominationService.getNominationById(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Nomination retrieved successfully", nomination));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<Nomination>>> getNominationsByStatus(@PathVariable String status) {
        List<Nomination> nominations = nominationService.getNominationsByStatus(
                Nomination.NominationStatus.valueOf(status.toUpperCase()));
        return ResponseEntity.ok(new ApiResponse<>(true, "Nominations retrieved successfully", nominations));
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Nomination>> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String notes) {
        try {
            Nomination nomination = nominationService.updateStatus(
                    id, Nomination.NominationStatus.valueOf(status.toUpperCase()), notes);
            return ResponseEntity.ok(new ApiResponse<>(true, "Status updated successfully", nomination));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping("/stats/count/{status}")
    public ResponseEntity<ApiResponse<Long>> countByStatus(@PathVariable String status) {
        Long count = nominationService.countByStatus(
                Nomination.NominationStatus.valueOf(status.toUpperCase()));
        return ResponseEntity.ok(new ApiResponse<>(true, "Count retrieved successfully", count));
    }
}
