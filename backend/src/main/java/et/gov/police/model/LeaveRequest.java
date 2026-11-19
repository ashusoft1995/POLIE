package et.gov.police.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "leave_requests")
public class LeaveRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private User employee;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private LeaveType leaveType;
    
    @Column(nullable = false)
    private LocalDate startDate;
    
    @Column(nullable = false)
    private LocalDate endDate;
    
    @Column(nullable = false)
    private Integer numberOfDays;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String reason;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private LeaveStatus status = LeaveStatus.PENDING;
    
    @Column(nullable = false)
    private LocalDateTime requestedAt = LocalDateTime.now();
    
    @ManyToOne
    @JoinColumn(name = "approved_by_id")
    private User approvedBy;
    
    private LocalDateTime reviewedAt;
    
    @Column(columnDefinition = "TEXT")
    private String reviewNotes;
    
    private String contactDuringLeave;
    
    public enum LeaveType {
        ANNUAL,
        SICK,
        EMERGENCY,
        MATERNITY,
        PATERNITY,
        UNPAID,
        STUDY,
        COMPASSIONATE
    }
    
    public enum LeaveStatus {
        PENDING,
        APPROVED,
        REJECTED,
        CANCELLED
    }
    
    // Constructors
    public LeaveRequest() {}
    
    // Getters
    public Long getId() { return id; }
    public User getEmployee() { return employee; }
    public LeaveType getLeaveType() { return leaveType; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public Integer getNumberOfDays() { return numberOfDays; }
    public String getReason() { return reason; }
    public LeaveStatus getStatus() { return status; }
    public LocalDateTime getRequestedAt() { return requestedAt; }
    public User getApprovedBy() { return approvedBy; }
    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public String getReviewNotes() { return reviewNotes; }
    public String getContactDuringLeave() { return contactDuringLeave; }
    
    // Setters
    public void setId(Long id) { this.id = id; }
    public void setEmployee(User employee) { this.employee = employee; }
    public void setLeaveType(LeaveType leaveType) { this.leaveType = leaveType; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public void setNumberOfDays(Integer numberOfDays) { this.numberOfDays = numberOfDays; }
    public void setReason(String reason) { this.reason = reason; }
    public void setStatus(LeaveStatus status) { this.status = status; }
    public void setRequestedAt(LocalDateTime requestedAt) { this.requestedAt = requestedAt; }
    public void setApprovedBy(User approvedBy) { this.approvedBy = approvedBy; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }
    public void setReviewNotes(String reviewNotes) { this.reviewNotes = reviewNotes; }
    public void setContactDuringLeave(String contactDuringLeave) { this.contactDuringLeave = contactDuringLeave; }
}
