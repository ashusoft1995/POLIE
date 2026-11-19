package et.gov.police.repository;

import et.gov.police.model.LeaveRequest;
import et.gov.police.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    
    List<LeaveRequest> findByEmployee(User employee);
    
    List<LeaveRequest> findByEmployeeOrderByRequestedAtDesc(User employee);
    
    List<LeaveRequest> findByStatus(LeaveRequest.LeaveStatus status);
    
    List<LeaveRequest> findByStatusOrderByRequestedAtDesc(LeaveRequest.LeaveStatus status);
    
    List<LeaveRequest> findAllByOrderByRequestedAtDesc();
    
    Long countByStatus(LeaveRequest.LeaveStatus status);
    
    Long countByEmployeeAndStatus(User employee, LeaveRequest.LeaveStatus status);
}
