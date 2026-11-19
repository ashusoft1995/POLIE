package et.gov.police.repository;

import et.gov.police.model.Case;
import et.gov.police.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CaseRepository extends JpaRepository<Case, Long> {
    
    Optional<Case> findByCaseNumber(String caseNumber);
    
    List<Case> findByAssignedDetective(User detective);
    
    List<Case> findByAssignedDetectiveOrderByCreatedAtDesc(User detective);
    
    List<Case> findByStatus(Case.CaseStatus status);
    
    List<Case> findByStatusOrderByCreatedAtDesc(Case.CaseStatus status);
    
    List<Case> findAllByOrderByCreatedAtDesc();
    
    Long countByStatus(Case.CaseStatus status);
    
    Long countByAssignedDetectiveAndStatus(User detective, Case.CaseStatus status);
    
    List<Case> findByPriority(Case.CasePriority priority);
}
