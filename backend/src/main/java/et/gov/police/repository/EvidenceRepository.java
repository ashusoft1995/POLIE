package et.gov.police.repository;

import et.gov.police.model.Case;
import et.gov.police.model.Evidence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EvidenceRepository extends JpaRepository<Evidence, Long> {
    
    Optional<Evidence> findByEvidenceNumber(String evidenceNumber);
    
    List<Evidence> findByCaseEntity(Case caseEntity);
    
    List<Evidence> findByCaseEntityOrderByCollectedDateDesc(Case caseEntity);
    
    List<Evidence> findByType(Evidence.EvidenceType type);
    
    List<Evidence> findByCustody(Evidence.ChainOfCustody custody);
    
    Long countByCaseEntity(Case caseEntity);
}
