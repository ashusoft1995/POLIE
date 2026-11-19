package et.gov.police.service;

import et.gov.police.dto.MissingPersonRequest;
import et.gov.police.model.MissingPerson;
import et.gov.police.model.User;
import et.gov.police.repository.MissingPersonRepository;
import et.gov.police.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MissingPersonService {
    
    private final MissingPersonRepository missingPersonRepository;
    private final UserRepository userRepository;
    
    public MissingPersonService(MissingPersonRepository missingPersonRepository, UserRepository userRepository) {
        this.missingPersonRepository = missingPersonRepository;
        this.userRepository = userRepository;
    }
    
    @Transactional
    public MissingPerson submitReport(MissingPersonRequest request) {
        MissingPerson report = new MissingPerson();
        report.setReporterName(request.getReporterName());
        report.setReporterPhone(request.getReporterPhone());
        report.setReporterEmail(request.getReporterEmail());
        report.setReporterRelationship(request.getReporterRelationship());
        report.setMissingPersonName(request.getMissingPersonName());
        report.setMissingPersonAge(request.getMissingPersonAge());
        report.setGender(request.getGender());
        report.setHeight(request.getHeight());
        report.setWeight(request.getWeight());
        report.setPhysicalDescription(request.getPhysicalDescription());
        report.setLastSeenWearing(request.getLastSeenWearing());
        report.setLastSeenLocation(request.getLastSeenLocation());
        report.setLastSeenDate(request.getLastSeenDate());
        report.setCircumstances(request.getCircumstances());
        report.setMedicalConditions(request.getMedicalConditions());
        report.setIsCritical(request.getIsCritical() != null ? request.getIsCritical() : false);
        report.setStatus(MissingPerson.ReportStatus.ACTIVE);
        report.setReportedAt(LocalDateTime.now());
        
        // Generate case number
        String caseNumber = "MP-" + LocalDateTime.now().getYear() + "-" + 
                           String.format("%06d", missingPersonRepository.count() + 1);
        report.setCaseNumber(caseNumber);
        
        return missingPersonRepository.save(report);
    }
    
    public List<MissingPerson> getAllReports() {
        return missingPersonRepository.findAllByOrderByReportedAtDesc();
    }
    
    public List<MissingPerson> getReportsByStatus(MissingPerson.ReportStatus status) {
        return missingPersonRepository.findByStatusOrderByReportedAtDesc(status);
    }
    
    public MissingPerson getReportById(Long id) {
        return missingPersonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
    }
    
    @Transactional
    public MissingPerson assignOfficer(Long reportId, Long officerId) {
        MissingPerson report = getReportById(reportId);
        User officer = userRepository.findById(officerId)
                .orElseThrow(() -> new RuntimeException("Officer not found"));
        
        report.setAssignedOfficer(officer);
        report.setAssignedAt(LocalDateTime.now());
        report.setStatus(MissingPerson.ReportStatus.UNDER_INVESTIGATION);
        
        return missingPersonRepository.save(report);
    }
    
    @Transactional
    public MissingPerson updateStatus(Long reportId, MissingPerson.ReportStatus status, String notes) {
        MissingPerson report = getReportById(reportId);
        report.setStatus(status);
        if (notes != null) {
            report.setInvestigationNotes(notes);
        }
        return missingPersonRepository.save(report);
    }
    
    public List<MissingPerson> getOfficerReports(Long officerId) {
        User officer = userRepository.findById(officerId)
                .orElseThrow(() -> new RuntimeException("Officer not found"));
        return missingPersonRepository.findByAssignedOfficerOrderByReportedAtDesc(officer);
    }
    
    public Long countByStatus(MissingPerson.ReportStatus status) {
        return missingPersonRepository.countByStatus(status);
    }
}
