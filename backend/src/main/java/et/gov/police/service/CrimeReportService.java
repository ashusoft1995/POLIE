package et.gov.police.service;

import et.gov.police.dto.CrimeReportRequest;
import et.gov.police.model.CrimeReport;
import et.gov.police.model.User;
import et.gov.police.repository.CrimeReportRepository;
import et.gov.police.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class CrimeReportService {
    
    private final CrimeReportRepository crimeReportRepository;
    private final UserRepository userRepository;
    
    public CrimeReportService(CrimeReportRepository crimeReportRepository, UserRepository userRepository) {
        this.crimeReportRepository = crimeReportRepository;
        this.userRepository = userRepository;
    }
    
    @Transactional
    public CrimeReport submitReport(CrimeReportRequest request) {
        CrimeReport report = new CrimeReport();
        report.setReporterName(request.getReporterName());
        report.setReporterPhone(request.getReporterPhone());
        report.setReporterEmail(request.getReporterEmail());
        report.setReporterAddress(request.getReporterAddress());
        report.setCrimeType(request.getCrimeType());
        report.setDescription(request.getDescription());
        report.setIncidentLocation(request.getIncidentLocation());
        report.setIncidentDate(request.getIncidentDate());
        report.setSuspectDescription(request.getSuspectDescription());
        report.setIsUrgent(request.getIsUrgent() != null ? request.getIsUrgent() : false);
        report.setStatus(CrimeReport.ReportStatus.PENDING);
        report.setSubmittedAt(LocalDateTime.now());
        
        // Generate case number
        String caseNumber = "CR-" + LocalDateTime.now().getYear() + "-" + 
                           String.format("%06d", crimeReportRepository.count() + 1);
        report.setCaseNumber(caseNumber);
        
        return crimeReportRepository.save(report);
    }
    
    public List<CrimeReport> getAllReports() {
        return crimeReportRepository.findAllByOrderBySubmittedAtDesc();
    }
    
    public List<CrimeReport> getReportsByStatus(CrimeReport.ReportStatus status) {
        return crimeReportRepository.findByStatusOrderBySubmittedAtDesc(status);
    }
    
    public CrimeReport getReportById(Long id) {
        return crimeReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
    }
    
    @Transactional
    public CrimeReport assignOfficer(Long reportId, Long officerId) {
        CrimeReport report = getReportById(reportId);
        User officer = userRepository.findById(officerId)
                .orElseThrow(() -> new RuntimeException("Officer not found"));
        
        report.setAssignedOfficer(officer);
        report.setAssignedAt(LocalDateTime.now());
        report.setStatus(CrimeReport.ReportStatus.ASSIGNED);
        
        return crimeReportRepository.save(report);
    }
    
    @Transactional
    public CrimeReport updateStatus(Long reportId, CrimeReport.ReportStatus status, String notes) {
        CrimeReport report = getReportById(reportId);
        report.setStatus(status);
        if (notes != null) {
            report.setOfficerNotes(notes);
        }
        return crimeReportRepository.save(report);
    }
    
    public List<CrimeReport> getOfficerReports(Long officerId) {
        User officer = userRepository.findById(officerId)
                .orElseThrow(() -> new RuntimeException("Officer not found"));
        return crimeReportRepository.findByAssignedOfficerOrderBySubmittedAtDesc(officer);
    }
    
    public Long countByStatus(CrimeReport.ReportStatus status) {
        return crimeReportRepository.countByStatus(status);
    }

    @Transactional
    public CrimeReport approveReport(Long reportId, String notes) {
        CrimeReport report = getReportById(reportId);
        report.setStatus(CrimeReport.ReportStatus.UNDER_REVIEW);
        if (notes != null && !notes.isBlank()) {
            report.setOfficerNotes(notes);
        }
        return crimeReportRepository.save(report);
    }

    @Transactional
    public CrimeReport rejectReport(Long reportId, String notes) {
        CrimeReport report = getReportById(reportId);
        report.setStatus(CrimeReport.ReportStatus.REJECTED);
        if (notes != null && !notes.isBlank()) {
            report.setOfficerNotes(notes);
        }
        return crimeReportRepository.save(report);
    }
}
