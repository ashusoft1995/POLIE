package et.gov.police.controller;

import et.gov.police.dto.ApiResponse;
import et.gov.police.dto.LeaveRequestDto;
import et.gov.police.model.LeaveRequest;
import et.gov.police.model.User;
import et.gov.police.security.UserDetailsServiceImpl;
import et.gov.police.service.LeaveRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-requests")
@CrossOrigin(origins = "*")
public class LeaveRequestController {
    
    private final LeaveRequestService leaveRequestService;
    
    public LeaveRequestController(LeaveRequestService leaveRequestService) {
        this.leaveRequestService = leaveRequestService;
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<LeaveRequest>> submitLeaveRequest(
            @RequestBody LeaveRequestDto request,
            Authentication authentication) {
        try {
            User user = ((UserDetailsServiceImpl.UserDetailsImpl) authentication.getPrincipal()).getUser();
            LeaveRequest leaveRequest = leaveRequestService.submitLeaveRequest(request, user.getId());
            return ResponseEntity.ok(new ApiResponse<>(true, "Leave request submitted successfully", leaveRequest));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<LeaveRequest>>> getAllLeaveRequests() {
        List<LeaveRequest> requests = leaveRequestService.getAllLeaveRequests();
        return ResponseEntity.ok(new ApiResponse<>(true, "Leave requests retrieved successfully", requests));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LeaveRequest>> getLeaveRequestById(@PathVariable Long id) {
        try {
            LeaveRequest request = leaveRequestService.getLeaveRequestById(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Leave request retrieved successfully", request));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/status/{status}")
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<List<LeaveRequest>>> getLeaveRequestsByStatus(@PathVariable String status) {
        try {
            List<LeaveRequest> requests = leaveRequestService.getLeaveRequestsByStatus(
                    LeaveRequest.LeaveStatus.valueOf(status.toUpperCase()));
            return ResponseEntity.ok(new ApiResponse<>(true, "Leave requests retrieved successfully", requests));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse<List<LeaveRequest>>> getEmployeeLeaveRequests(@PathVariable Long employeeId) {
        try {
            List<LeaveRequest> requests = leaveRequestService.getEmployeeLeaveRequests(employeeId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Leave requests retrieved successfully", requests));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @PostMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<LeaveRequest>> approveLeaveRequest(
            @PathVariable Long id,
            @RequestParam(required = false) String notes,
            Authentication authentication) {
        try {
            User user = ((UserDetailsServiceImpl.UserDetailsImpl) authentication.getPrincipal()).getUser();
            LeaveRequest request = leaveRequestService.approveLeaveRequest(id, user.getId(), notes);
            return ResponseEntity.ok(new ApiResponse<>(true, "Leave request approved successfully", request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
    
    @PostMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<LeaveRequest>> rejectLeaveRequest(
            @PathVariable Long id,
            @RequestParam(required = false) String notes,
            Authentication authentication) {
        try {
            User user = ((UserDetailsServiceImpl.UserDetailsImpl) authentication.getPrincipal()).getUser();
            LeaveRequest request = leaveRequestService.rejectLeaveRequest(id, user.getId(), notes);
            return ResponseEntity.ok(new ApiResponse<>(true, "Leave request rejected successfully", request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}
