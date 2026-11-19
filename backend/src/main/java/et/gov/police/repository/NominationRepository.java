package et.gov.police.repository;

import et.gov.police.model.Nomination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NominationRepository extends JpaRepository<Nomination, Long> {
    
    List<Nomination> findByStatus(Nomination.NominationStatus status);
    
    List<Nomination> findByStatusOrderBySubmittedAtDesc(Nomination.NominationStatus status);
    
    List<Nomination> findAllByOrderBySubmittedAtDesc();
    
    Long countByStatus(Nomination.NominationStatus status);
}
