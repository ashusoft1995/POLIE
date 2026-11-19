package et.gov.police.controller;

import et.gov.police.dto.ApiResponse;
import et.gov.police.dto.TrafficReportRequest;
import et.gov.police.model.TrafficReport;
import et.gov.police.service.TrafficReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/traffic-reports")
@CrossOrigin(origins = "*")
public class TrafficReportController {
    
    private final TrafficReportService trafficReportService;
    
    public TrafficReportController(TrafficReportService trafficReportService) {
        this.trafficReportService = trafficReportService;
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<TrafficReport>> submitReport(@RequestBody TrafficReportRequest request) {
        try {
            TrafficReport report = trafficReportService.submitReport(request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Traffic report submitted successfully", report));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<TrafficReport>>> getAllReports() {
        List<TrafficReport> reports = trafficReportService.getAllReports();
        return ResponseEntity.ok(new ApiResponse<>(true, "Reports retrieved successfully", reports));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TrafficReport>> getReportById(@PathVariable Long id) {
        try {
            TrafficReport report = trafficReportService.getReportById(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Report retrieved successfully", report));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<TrafficReport>>> getReportsByStatus(@PathVariable String status) {
        List<TrafficReport> reports = trafficReportService.getReportsByStatus(
                TrafficReport.ReportStatus.valueOf(status.toUpperCase()));
        return ResponseEntity.ok(new ApiResponse<>(true, "Reports retrieved successfully", reports));
    }
    
    @PostMapping("/{id}/assign/{officerId}")
    public ResponseEntity<ApiResponse<TrafficReport>> assignOfficer(
            @PathVariable Long id, 
            @PathVariable Long officerId) {
        try {
            TrafficReport report = trafficReportService.assignOfficer(id, officerId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Officer assigned successfully", report));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TrafficReport>> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String notes) {
        try {
            TrafficReport report = trafficReportService.updateStatus(
                    id, TrafficReport.ReportStatus.valueOf(status.toUpperCase()), notes);
            return ResponseEntity.ok(new ApiResponse<>(true, "Status updated successfully", report));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping("/officer/{officerId}")
    public ResponseEntity<ApiResponse<List<TrafficReport>>> getOfficerReports(@PathVariable Long officerId) {
        List<TrafficReport> reports = trafficReportService.getOfficerReports(officerId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Reports retrieved successfully", reports));
    }
}
