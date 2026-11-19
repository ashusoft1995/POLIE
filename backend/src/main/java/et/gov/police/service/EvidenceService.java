package et.gov.police.service;

import et.gov.police.dto.EvidenceRequest;
import et.gov.police.model.Case;
import et.gov.police.model.Evidence;
import et.gov.police.model.User;
import et.gov.police.repository.CaseRepository;
import et.gov.police.repository.EvidenceRepository;
import et.gov.police.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EvidenceService {
    
    private final EvidenceRepository evidenceRepository;
    private final CaseRepository caseRepository;
    private final UserRepository userRepository;
    
    public EvidenceService(EvidenceRepository evidenceRepository, CaseRepository caseRepository, UserRepository userRepository) {
        this.evidenceRepository = evidenceRepository;
        this.caseRepository = caseRepository;
        this.userRepository = userRepository;
    }
    
    @Transactional
    public Evidence addEvidence(EvidenceRequest request, Long collectedById) {
        Evidence evidence = new Evidence();
        
        // Generate evidence number
        String evidenceNumber = "EV-" + LocalDateTime.now().getYear() + "-" + 
                               String.format("%08d", evidenceRepository.count() + 1);
        evidence.setEvidenceNumber(evidenceNumber);
        
        // Link to case
        Case caseEntity = caseRepository.findById(request.getCaseId())
                .orElseThrow(() -> new RuntimeException("Case not found"));
        evidence.setCaseEntity(caseEntity);
        
        evidence.setType(Evidence.EvidenceType.valueOf(request.getType()));
        evidence.setDescription(request.getDescription());
        evidence.setCollectedLocation(request.getCollectedLocation());
        evidence.setCollectedDate(request.getCollectedDate());
        evidence.setStorageLocation(request.getStorageLocation());
        evidence.setNotes(request.getNotes());
        evidence.setFilePath(request.getFilePath());
        
        // Set collector
        User collector = userRepository.findById(collectedById)
                .orElseThrow(() -> new RuntimeException("User not found"));
        evidence.setCollectedBy(collector);
        
        evidence.setCustody(Evidence.ChainOfCustody.COLLECTED);
        evidence.setCreatedAt(LocalDateTime.now());
        
        return evidenceRepository.save(evidence);
    }
    
    public List<Evidence> getEvidenceByCase(Long caseId) {
        Case caseEntity = caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found"));
        return evidenceRepository.findByCaseEntityOrderByCollectedDateDesc(caseEntity);
    }
    
    public Evidence getEvidenceById(Long id) {
        return evidenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evidence not found"));
    }
    
    @Transactional
    public Evidence updateCustody(Long evidenceId, Evidence.ChainOfCustody custody) {
        Evidence evidence = getEvidenceById(evidenceId);
        evidence.setCustody(custody);
        return evidenceRepository.save(evidence);
    }
    
    @Transactional
    public Evidence addAnalysis(Long evidenceId, String analysisResult) {
        Evidence evidence = getEvidenceById(evidenceId);
        evidence.setAnalysisResult(analysisResult);
        evidence.setAnalyzedAt(LocalDateTime.now());
        evidence.setCustody(Evidence.ChainOfCustody.IN_ANALYSIS);
        return evidenceRepository.save(evidence);
    }
    
    public Long countByCase(Long caseId) {
        Case caseEntity = caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found"));
        return evidenceRepository.countByCaseEntity(caseEntity);
    }
}
