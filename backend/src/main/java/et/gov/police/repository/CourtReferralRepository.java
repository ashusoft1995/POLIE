package et.gov.police.repository;

import et.gov.police.model.CourtReferral;
import et.gov.police.model.CourtReferral.ReferralStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourtReferralRepository extends JpaRepository<CourtReferral, Long> {
    
    Optional<CourtReferral> findByReferralNumber(String referralNumber);
    
    List<CourtReferral> findByStatus(ReferralStatus status);
    
    @Query("SELECT cr FROM CourtReferral cr WHERE cr.submittedByDetective.id = :detectiveId ORDER BY cr.submittedAt DESC")
    List<CourtReferral> findByDetectiveId(Long detectiveId);
    
    @Query("SELECT cr FROM CourtReferral cr ORDER BY cr.submittedAt DESC")
    List<CourtReferral> findAllOrderBySubmittedAtDesc();
    
    boolean existsByReferralNumber(String referralNumber);
}
