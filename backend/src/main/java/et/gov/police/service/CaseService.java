package et.gov.police.service;

import et.gov.police.dto.CaseRequest;
import et.gov.police.model.Case;
import et.gov.police.model.CrimeReport;
import et.gov.police.model.MissingPerson;
import et.gov.police.model.User;
import et.gov.police.repository.CaseRepository;
import et.gov.police.repository.CrimeReportRepository;
import et.gov.police.repository.MissingPersonRepository;
import et.gov.police.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CaseService {
    
    private final CaseRepository caseRepository;
    private final UserRepository userRepository;
    private final CrimeReportRepository crimeReportRepository;
    private final MissingPersonRepository missingPersonRepository;
    
    public CaseService(CaseRepository caseRepository, UserRepository userRepository,
                      CrimeReportRepository crimeReportRepository, MissingPersonRepository missingPersonRepository) {
        this.caseRepository = caseRepository;
        this.userRepository = userRepository;
        this.crimeReportRepository = crimeReportRepository;
        this.missingPersonRepository = missingPersonRepository;
    }
    
    @Transactional
    public Case createCase(CaseRequest request, Long createdById) {
        Case caseEntity = new Case();
        
        // Generate case number
        String caseNumber = "CASE-" + LocalDateTime.now().getYear() + "-" + 
                           String.format("%06d", caseRepository.count() + 1);
        caseEntity.setCaseNumber(caseNumber);
        
        caseEntity.setTitle(request.getTitle());
        caseEntity.setCaseType(Case.CaseType.valueOf(request.getCaseType()));
        caseEntity.setDescription(request.getDescription());
        caseEntity.setPriority(Case.CasePriority.valueOf(request.getPriority()));
        caseEntity.setLocation(request.getLocation());
        caseEntity.setIncidentDate(request.getIncidentDate());
        
        // Assign detective
        User detective = userRepository.findById(request.getAssignedDetectiveId())
                .orElseThrow(() -> new RuntimeException("Detective not found"));
        caseEntity.setAssignedDetective(detective);
        caseEntity.setAssignedAt(LocalDateTime.now());
        
        // Set creator
        User creator = userRepository.findById(createdById)
                .orElseThrow(() -> new RuntimeException("User not found"));
        caseEntity.setCreatedBy(creator);
        
        // Link related reports
        if (request.getCrimeReportId() != null) {
            CrimeReport crimeReport = crimeReportRepository.findById(request.getCrimeReportId())
                    .orElseThrow(() -> new RuntimeException("Crime report not found"));
            caseEntity.setRelatedCrimeReport(crimeReport);
        }
        
        if (request.getMissingPersonId() != null) {
            MissingPerson missingPerson = missingPersonRepository.findById(request.getMissingPersonId())
                    .orElseThrow(() -> new RuntimeException("Missing person report not found"));
            caseEntity.setRelatedMissingPerson(missingPerson);
        }
        
        caseEntity.setStatus(Case.CaseStatus.OPEN);
        caseEntity.setCreatedAt(LocalDateTime.now());
        
        return caseRepository.save(caseEntity);
    }
    
    public List<Case> getAllCases() {
        return caseRepository.findAllByOrderByCreatedAtDesc();
    }
    
    public List<Case> getCasesByDetective(Long detectiveId) {
        User detective = userRepository.findById(detectiveId)
                .orElseThrow(() -> new RuntimeException("Detective not found"));
        return caseRepository.findByAssignedDetectiveOrderByCreatedAtDesc(detective);
    }
    
    public List<Case> getCasesByStatus(Case.CaseStatus status) {
        return caseRepository.findByStatusOrderByCreatedAtDesc(status);
    }
    
    public Case getCaseById(Long id) {
        return caseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Case not found"));
    }
    
    public Case getCaseByCaseNumber(String caseNumber) {
        return caseRepository.findByCaseNumber(caseNumber)
                .orElseThrow(() -> new RuntimeException("Case not found"));
    }
    
    @Transactional
    public Case updateCaseStatus(Long caseId, Case.CaseStatus status) {
        Case caseEntity = getCaseById(caseId);
        caseEntity.setStatus(status);
        
        if (status == Case.CaseStatus.CLOSED_SOLVED || status == Case.CaseStatus.CLOSED_UNSOLVED) {
            caseEntity.setClosedAt(LocalDateTime.now());
        }
        
        return caseRepository.save(caseEntity);
    }
    
    @Transactional
    public Case updateInvestigationNotes(Long caseId, String notes) {
        Case caseEntity = getCaseById(caseId);
        caseEntity.setInvestigationNotes(notes);
        return caseRepository.save(caseEntity);
    }
    
    @Transactional
    public Case closeCase(Long caseId, Case.CaseStatus closureStatus, String closureNotes) {
        Case caseEntity = getCaseById(caseId);
        caseEntity.setStatus(closureStatus);
        caseEntity.setClosureNotes(closureNotes);
        caseEntity.setClosedAt(LocalDateTime.now());
        return caseRepository.save(caseEntity);
    }
    
    public Long countByStatus(Case.CaseStatus status) {
        return caseRepository.countByStatus(status);
    }
}
