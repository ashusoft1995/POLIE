package et.gov.police.controller;

import et.gov.police.dto.ApiResponse;
import et.gov.police.dto.CrimeReportRequest;
import et.gov.police.model.CrimeReport;
import et.gov.police.service.CrimeReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crime-reports")
@CrossOrigin(origins = "*")
public class CrimeReportController {
    
    private final CrimeReportService crimeReportService;
    
    public CrimeReportController(CrimeReportService crimeReportService) {
        this.crimeReportService = crimeReportService;
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<CrimeReport>> submitReport(@RequestBody CrimeReportRequest request) {
        try {
            CrimeReport report = crimeReportService.submitReport(request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Crime report submitted successfully", report));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<CrimeReport>>> getAllReports() {
        List<CrimeReport> reports = crimeReportService.getAllReports();
        return ResponseEntity.ok(new ApiResponse<>(true, "Reports retrieved successfully", reports));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CrimeReport>> getReportById(@PathVariable Long id) {
        try {
            CrimeReport report = crimeReportService.getReportById(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Report retrieved successfully", report));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<CrimeReport>>> getReportsByStatus(@PathVariable String status) {
        List<CrimeReport> reports = crimeReportService.getReportsByStatus(
                CrimeReport.ReportStatus.valueOf(status.toUpperCase()));
        return ResponseEntity.ok(new ApiResponse<>(true, "Reports retrieved successfully", reports));
    }
    
    @PostMapping("/{id}/assign/{officerId}")
    public ResponseEntity<ApiResponse<CrimeReport>> assignOfficer(
            @PathVariable Long id, 
            @PathVariable Long officerId) {
        try {
            CrimeReport report = crimeReportService.assignOfficer(id, officerId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Officer assigned successfully", report));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<CrimeReport>> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String notes) {
        try {
            CrimeReport report = crimeReportService.updateStatus(
                    id, CrimeReport.ReportStatus.valueOf(status.toUpperCase()), notes);
            return ResponseEntity.ok(new ApiResponse<>(true, "Status updated successfully", report));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping("/officer/{officerId}")
    public ResponseEntity<ApiResponse<List<CrimeReport>>> getOfficerReports(@PathVariable Long officerId) {
        List<CrimeReport> reports = crimeReportService.getOfficerReports(officerId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Reports retrieved successfully", reports));
    }
    
    @GetMapping("/stats/count/{status}")
    public ResponseEntity<ApiResponse<Long>> countByStatus(@PathVariable String status) {
        Long count = crimeReportService.countByStatus(
                CrimeReport.ReportStatus.valueOf(status.toUpperCase()));
        return ResponseEntity.ok(new ApiResponse<>(true, "Count retrieved successfully", count));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<CrimeReport>> approveReport(
            @PathVariable Long id,
            @RequestParam(required = false) String notes) {
        try {
            CrimeReport report = crimeReportService.approveReport(id, notes);
            return ResponseEntity.ok(new ApiResponse<>(true, "Report approved for investigation", report));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<CrimeReport>> rejectReport(
            @PathVariable Long id,
            @RequestParam(required = false) String notes) {
        try {
            CrimeReport report = crimeReportService.rejectReport(id, notes);
            return ResponseEntity.ok(new ApiResponse<>(true, "Report rejected", report));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}
