package et.gov.police.service;

import et.gov.police.dto.NominationRequest;
import et.gov.police.model.Nomination;
import et.gov.police.repository.NominationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NominationService {
    
    private final NominationRepository nominationRepository;
    
    public NominationService(NominationRepository nominationRepository) {
        this.nominationRepository = nominationRepository;
    }
    
    @Transactional
    public Nomination submitNomination(NominationRequest request) {
        Nomination nomination = new Nomination();
        nomination.setNominatorName(request.getNominatorName());
        nomination.setNominatorPhone(request.getNominatorPhone());
        nomination.setNominatorEmail(request.getNominatorEmail());
        nomination.setOfficerName(request.getOfficerName());
        nomination.setOfficerBadgeNumber(request.getOfficerBadgeNumber());
        nomination.setDepartment(request.getDepartment());
        nomination.setCategory(Nomination.NominationCategory.valueOf(request.getCategory()));
        nomination.setReason(request.getReason());
        nomination.setIncidentDate(request.getIncidentDate());
        nomination.setIncidentLocation(request.getIncidentLocation());
        nomination.setStatus(Nomination.NominationStatus.PENDING);
        nomination.setSubmittedAt(LocalDateTime.now());
        
        // Generate nomination number
        String nominationNumber = "NOM-" + LocalDateTime.now().getYear() + "-" + 
                                 String.format("%06d", nominationRepository.count() + 1);
        nomination.setNominationNumber(nominationNumber);
        
        return nominationRepository.save(nomination);
    }
    
    public List<Nomination> getAllNominations() {
        return nominationRepository.findAllByOrderBySubmittedAtDesc();
    }
    
    public List<Nomination> getNominationsByStatus(Nomination.NominationStatus status) {
        return nominationRepository.findByStatusOrderBySubmittedAtDesc(status);
    }
    
    public Nomination getNominationById(Long id) {
        return nominationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nomination not found"));
    }
    
    @Transactional
    public Nomination updateStatus(Long nominationId, Nomination.NominationStatus status, String notes) {
        Nomination nomination = getNominationById(nominationId);
        nomination.setStatus(status);
        if (notes != null) {
            nomination.setReviewNotes(notes);
        }
        nomination.setReviewedAt(LocalDateTime.now());
        return nominationRepository.save(nomination);
    }
    
    public Long countByStatus(Nomination.NominationStatus status) {
        return nominationRepository.countByStatus(status);
    }
}
