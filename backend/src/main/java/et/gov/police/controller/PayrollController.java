package et.gov.police.controller;

import et.gov.police.dto.ApiResponse;
import et.gov.police.dto.PayrollRequest;
import et.gov.police.model.Payroll;
import et.gov.police.model.User;
import et.gov.police.security.UserDetailsServiceImpl;
import et.gov.police.service.PayrollService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payroll")
@CrossOrigin(origins = "*")
public class PayrollController {
    
    private final PayrollService payrollService;
    
    public PayrollController(PayrollService payrollService) {
        this.payrollService = payrollService;
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<Payroll>> generatePayroll(
            @RequestBody PayrollRequest request,
            Authentication authentication) {
        try {
            User user = ((UserDetailsServiceImpl.UserDetailsImpl) authentication.getPrincipal()).getUser();
            Payroll payroll = payrollService.generatePayroll(request, user.getId());
            return ResponseEntity.ok(new ApiResponse<>(true, "Payroll generated successfully", payroll));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<Payroll>>> getAllPayrolls() {
        List<Payroll> payrolls = payrollService.getAllPayrolls();
        return ResponseEntity.ok(new ApiResponse<>(true, "Payrolls retrieved successfully", payrolls));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Payroll>> getPayrollById(@PathVariable Long id) {
        try {
            Payroll payroll = payrollService.getPayrollById(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Payroll retrieved successfully", payroll));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse<List<Payroll>>> getEmployeePayrolls(@PathVariable Long employeeId) {
        try {
            List<Payroll> payrolls = payrollService.getEmployeePayrolls(employeeId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Payrolls retrieved successfully", payrolls));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping("/period/{month}/{year}")
    public ResponseEntity<ApiResponse<List<Payroll>>> getPayrollsByPeriod(
            @PathVariable Integer month,
            @PathVariable Integer year) {
        List<Payroll> payrolls = payrollService.getPayrollsByPeriod(month, year);
        return ResponseEntity.ok(new ApiResponse<>(true, "Payrolls retrieved successfully", payrolls));
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Payroll>> updatePayrollStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String paymentReference) {
        try {
            Payroll payroll = payrollService.updatePayrollStatus(
                    id, Payroll.PaymentStatus.valueOf(status.toUpperCase()), paymentReference);
            return ResponseEntity.ok(new ApiResponse<>(true, "Payroll status updated successfully", payroll));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}
