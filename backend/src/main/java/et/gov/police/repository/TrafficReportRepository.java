package et.gov.police.repository;

import et.gov.police.model.TrafficReport;
import et.gov.police.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TrafficReportRepository extends JpaRepository<TrafficReport, Long> {
    
    List<TrafficReport> findByStatus(TrafficReport.ReportStatus status);
    
    List<TrafficReport> findByAssignedOfficer(User officer);
    
    List<TrafficReport> findByAssignedOfficerOrderBySubmittedAtDesc(User officer);
    
    List<TrafficReport> findByStatusOrderBySubmittedAtDesc(TrafficReport.ReportStatus status);
    
    List<TrafficReport> findAllByOrderBySubmittedAtDesc();
    
    Long countByStatus(TrafficReport.ReportStatus status);
}
