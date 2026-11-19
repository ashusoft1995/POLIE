package et.gov.police.controller;

import et.gov.police.dto.ApiResponse;
import et.gov.police.dto.EmployeeRegistrationRequest;
import et.gov.police.model.Role;
import et.gov.police.model.User;
import et.gov.police.service.EmployeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {
    
    private final EmployeeService employeeService;
    
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<User>> registerEmployee(@RequestBody EmployeeRegistrationRequest request) {
        try {
            User employee = employeeService.registerEmployee(request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Employee registered successfully", employee));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<User>>> getAllEmployees() {
        List<User> employees = employeeService.getAllEmployees();
        return ResponseEntity.ok(new ApiResponse<>(true, "Employees retrieved successfully", employees));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> getEmployeeById(@PathVariable Long id) {
        try {
            User employee = employeeService.getEmployeeById(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Employee retrieved successfully", employee));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/role/{role}")
    public ResponseEntity<ApiResponse<List<User>>> getEmployeesByRole(@PathVariable String role) {
        try {
            List<User> employees = employeeService.getEmployeesByRole(Role.valueOf(role.toUpperCase()));
            return ResponseEntity.ok(new ApiResponse<>(true, "Employees retrieved successfully", employees));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<User>> updateEmployee(
            @PathVariable Long id,
            @RequestBody EmployeeRegistrationRequest request) {
        try {
            User employee = employeeService.updateEmployee(id, request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Employee updated successfully", employee));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @PostMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<String>> toggleEmployeeStatus(@PathVariable Long id) {
        try {
            employeeService.toggleEmployeeStatus(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Employee status updated successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteEmployee(@PathVariable Long id) {
        try {
            employeeService.deleteEmployee(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Employee deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping("/stats/count")
    public ResponseEntity<ApiResponse<Long>> countAllEmployees() {
        Long count = employeeService.countAll();
        return ResponseEntity.ok(new ApiResponse<>(true, "Count retrieved successfully", count));
    }
}
