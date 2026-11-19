package et.gov.police.repository;

import et.gov.police.model.MissingPerson;
import et.gov.police.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MissingPersonRepository extends JpaRepository<MissingPerson, Long> {
    
    List<MissingPerson> findByStatus(MissingPerson.ReportStatus status);
    
    List<MissingPerson> findByAssignedOfficer(User officer);
    
    List<MissingPerson> findByAssignedOfficerOrderByReportedAtDesc(User officer);
    
    List<MissingPerson> findByStatusOrderByReportedAtDesc(MissingPerson.ReportStatus status);
    
    List<MissingPerson> findAllByOrderByReportedAtDesc();
    
    Long countByStatus(MissingPerson.ReportStatus status);
}
