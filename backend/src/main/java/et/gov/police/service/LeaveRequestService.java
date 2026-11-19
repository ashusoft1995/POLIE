package et.gov.police.service;

import et.gov.police.dto.LeaveRequestDto;
import et.gov.police.model.LeaveRequest;
import et.gov.police.model.User;
import et.gov.police.repository.LeaveRequestRepository;
import et.gov.police.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class LeaveRequestService {
    
    private final LeaveRequestRepository leaveRequestRepository;
    private final UserRepository userRepository;
    
    public LeaveRequestService(LeaveRequestRepository leaveRequestRepository, UserRepository userRepository) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.userRepository = userRepository;
    }
    
    @Transactional
    public LeaveRequest submitLeaveRequest(LeaveRequestDto request, Long employeeId) {
        User employee = userRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        
        LeaveRequest leaveRequest = new LeaveRequest();
        leaveRequest.setEmployee(employee);
        leaveRequest.setLeaveType(LeaveRequest.LeaveType.valueOf(request.getLeaveType()));
        leaveRequest.setStartDate(request.getStartDate());
        leaveRequest.setEndDate(request.getEndDate());
        
        // Calculate number of days
        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;
        leaveRequest.setNumberOfDays((int) days);
        
        leaveRequest.setReason(request.getReason());
        leaveRequest.setContactDuringLeave(request.getContactDuringLeave());
        leaveRequest.setStatus(LeaveRequest.LeaveStatus.PENDING);
        leaveRequest.setRequestedAt(LocalDateTime.now());
        
        return leaveRequestRepository.save(leaveRequest);
    }
    
    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestRepository.findAllByOrderByRequestedAtDesc();
    }
    
    public List<LeaveRequest> getLeaveRequestsByStatus(LeaveRequest.LeaveStatus status) {
        return leaveRequestRepository.findByStatusOrderByRequestedAtDesc(status);
    }
    
    public List<LeaveRequest> getEmployeeLeaveRequests(Long employeeId) {
        User employee = userRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return leaveRequestRepository.findByEmployeeOrderByRequestedAtDesc(employee);
    }
    
    public LeaveRequest getLeaveRequestById(Long id) {
        return leaveRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));
    }
    
    @Transactional
    public LeaveRequest approveLeaveRequest(Long requestId, Long approverId, String notes) {
        LeaveRequest request = getLeaveRequestById(requestId);
        User approver = userRepository.findById(approverId)
                .orElseThrow(() -> new RuntimeException("Approver not found"));
        
        request.setStatus(LeaveRequest.LeaveStatus.APPROVED);
        request.setApprovedBy(approver);
        request.setReviewedAt(LocalDateTime.now());
        request.setReviewNotes(notes);
        
        return leaveRequestRepository.save(request);
    }
    
    @Transactional
    public LeaveRequest rejectLeaveRequest(Long requestId, Long reviewerId, String notes) {
        LeaveRequest request = getLeaveRequestById(requestId);
        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new RuntimeException("Reviewer not found"));
        
        request.setStatus(LeaveRequest.LeaveStatus.REJECTED);
        request.setApprovedBy(reviewer);
        request.setReviewedAt(LocalDateTime.now());
        request.setReviewNotes(notes);
        
        return leaveRequestRepository.save(request);
    }
    
    public Long countByStatus(LeaveRequest.LeaveStatus status) {
        return leaveRequestRepository.countByStatus(status);
    }
}
