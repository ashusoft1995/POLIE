package et.gov.police.service;

import et.gov.police.dto.TrafficReportRequest;
import et.gov.police.model.TrafficReport;
import et.gov.police.model.User;
import et.gov.police.repository.TrafficReportRepository;
import et.gov.police.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TrafficReportService {
    
    private final TrafficReportRepository trafficReportRepository;
    private final UserRepository userRepository;
    
    public TrafficReportService(TrafficReportRepository trafficReportRepository, UserRepository userRepository) {
        this.trafficReportRepository = trafficReportRepository;
        this.userRepository = userRepository;
    }
    
    @Transactional
    public TrafficReport submitReport(TrafficReportRequest request) {
        TrafficReport report = new TrafficReport();
        report.setReporterName(request.getReporterName());
        report.setReporterPhone(request.getReporterPhone());
        report.setReporterEmail(request.getReporterEmail());
        report.setIncidentType(request.getIncidentType());
        report.setDescription(request.getDescription());
        report.setLocation(request.getLocation());
        report.setIncidentDate(request.getIncidentDate());
        report.setVehiclePlateNumber(request.getVehiclePlateNumber());
        report.setVehicleType(request.getVehicleType());
        report.setVehicleColor(request.getVehicleColor());
        report.setInjuredCount(request.getInjuredCount() != null ? request.getInjuredCount() : 0);
        report.setFatalitiesCount(request.getFatalitiesCount() != null ? request.getFatalitiesCount() : 0);
        report.setPoliceNotified(request.getPoliceNotified() != null ? request.getPoliceNotified() : false);
        report.setStatus(TrafficReport.ReportStatus.PENDING);
        report.setSubmittedAt(LocalDateTime.now());
        
        // Generate report number
        String reportNumber = "TR-" + LocalDateTime.now().getYear() + "-" + 
                             String.format("%06d", trafficReportRepository.count() + 1);
        report.setReportNumber(reportNumber);
        
        return trafficReportRepository.save(report);
    }
    
    public List<TrafficReport> getAllReports() {
        return trafficReportRepository.findAllByOrderBySubmittedAtDesc();
    }
    
    public List<TrafficReport> getReportsByStatus(TrafficReport.ReportStatus status) {
        return trafficReportRepository.findByStatusOrderBySubmittedAtDesc(status);
    }
    
    public TrafficReport getReportById(Long id) {
        return trafficReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
    }
    
    @Transactional
    public TrafficReport assignOfficer(Long reportId, Long officerId) {
        TrafficReport report = getReportById(reportId);
        User officer = userRepository.findById(officerId)
                .orElseThrow(() -> new RuntimeException("Officer not found"));
        
        report.setAssignedOfficer(officer);
        report.setAssignedAt(LocalDateTime.now());
        report.setStatus(TrafficReport.ReportStatus.ASSIGNED);
        
        return trafficReportRepository.save(report);
    }
    
    @Transactional
    public TrafficReport updateStatus(Long reportId, TrafficReport.ReportStatus status, String notes) {
        TrafficReport report = getReportById(reportId);
        report.setStatus(status);
        if (notes != null) {
            report.setOfficerNotes(notes);
        }
        return trafficReportRepository.save(report);
    }
    
    public List<TrafficReport> getOfficerReports(Long officerId) {
        User officer = userRepository.findById(officerId)
                .orElseThrow(() -> new RuntimeException("Officer not found"));
        return trafficReportRepository.findByAssignedOfficerOrderBySubmittedAtDesc(officer);
    }
    
    public Long countByStatus(TrafficReport.ReportStatus status) {
        return trafficReportRepository.countByStatus(status);
    }
}
