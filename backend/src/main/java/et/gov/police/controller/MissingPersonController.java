package et.gov.police.controller;

import et.gov.police.dto.ApiResponse;
import et.gov.police.dto.MissingPersonRequest;
import et.gov.police.model.MissingPerson;
import et.gov.police.service.MissingPersonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/missing-persons")
@CrossOrigin(origins = "*")
public class MissingPersonController {
    
    private final MissingPersonService missingPersonService;
    
    public MissingPersonController(MissingPersonService missingPersonService) {
        this.missingPersonService = missingPersonService;
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<MissingPerson>> submitReport(@RequestBody MissingPersonRequest request) {
        try {
            MissingPerson report = missingPersonService.submitReport(request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Missing person report submitted successfully", report));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<MissingPerson>>> getAllReports() {
        List<MissingPerson> reports = missingPersonService.getAllReports();
        return ResponseEntity.ok(new ApiResponse<>(true, "Reports retrieved successfully", reports));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MissingPerson>> getReportById(@PathVariable Long id) {
        try {
            MissingPerson report = missingPersonService.getReportById(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Report retrieved successfully", report));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<MissingPerson>>> getReportsByStatus(@PathVariable String status) {
        List<MissingPerson> reports = missingPersonService.getReportsByStatus(
                MissingPerson.ReportStatus.valueOf(status.toUpperCase()));
        return ResponseEntity.ok(new ApiResponse<>(true, "Reports retrieved successfully", reports));
    }
    
    @PostMapping("/{id}/assign/{officerId}")
    public ResponseEntity<ApiResponse<MissingPerson>> assignOfficer(
            @PathVariable Long id, 
            @PathVariable Long officerId) {
        try {
            MissingPerson report = missingPersonService.assignOfficer(id, officerId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Officer assigned successfully", report));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<MissingPerson>> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String notes) {
        try {
            MissingPerson report = missingPersonService.updateStatus(
                    id, MissingPerson.ReportStatus.valueOf(status.toUpperCase()), notes);
            return ResponseEntity.ok(new ApiResponse<>(true, "Status updated successfully", report));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping("/officer/{officerId}")
    public ResponseEntity<ApiResponse<List<MissingPerson>>> getOfficerReports(@PathVariable Long officerId) {
        List<MissingPerson> reports = missingPersonService.getOfficerReports(officerId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Reports retrieved successfully", reports));
    }
}
