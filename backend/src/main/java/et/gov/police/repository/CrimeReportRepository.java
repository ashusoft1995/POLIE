package et.gov.police.repository;

import et.gov.police.model.CrimeReport;
import et.gov.police.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CrimeReportRepository extends JpaRepository<CrimeReport, Long> {
    
    List<CrimeReport> findByStatus(CrimeReport.ReportStatus status);
    
    List<CrimeReport> findByAssignedOfficer(User officer);
    
    List<CrimeReport> findByAssignedOfficerOrderBySubmittedAtDesc(User officer);
    
    List<CrimeReport> findByStatusOrderBySubmittedAtDesc(CrimeReport.ReportStatus status);
    
    List<CrimeReport> findAllByOrderBySubmittedAtDesc();
    
    Long countByStatus(CrimeReport.ReportStatus status);
    
    Long countByAssignedOfficerAndStatus(User officer, CrimeReport.ReportStatus status);
}
