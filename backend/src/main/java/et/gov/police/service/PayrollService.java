package et.gov.police.service;

import et.gov.police.dto.PayrollRequest;
import et.gov.police.model.Payroll;
import et.gov.police.model.User;
import et.gov.police.repository.PayrollRepository;
import et.gov.police.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PayrollService {
    
    private final PayrollRepository payrollRepository;
    private final UserRepository userRepository;
    
    public PayrollService(PayrollRepository payrollRepository, UserRepository userRepository) {
        this.payrollRepository = payrollRepository;
        this.userRepository = userRepository;
    }
    
    @Transactional
    public Payroll generatePayroll(PayrollRequest request, Long processedById) {
        User employee = userRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        
        // Check if payroll already exists for this period
        payrollRepository.findByEmployeeAndPayMonthAndPayYear(employee, request.getPayMonth(), request.getPayYear())
                .ifPresent(p -> {
                    throw new RuntimeException("Payroll already exists for this period");
                });
        
        Payroll payroll = new Payroll();
        payroll.setEmployee(employee);
        payroll.setPayMonth(request.getPayMonth());
        payroll.setPayYear(request.getPayYear());
        payroll.setBasicSalary(request.getBasicSalary());
        payroll.setAllowances(request.getAllowances() != null ? request.getAllowances() : BigDecimal.ZERO);
        payroll.setOvertimePay(request.getOvertimePay() != null ? request.getOvertimePay() : BigDecimal.ZERO);
        payroll.setDeductions(request.getDeductions() != null ? request.getDeductions() : BigDecimal.ZERO);
        payroll.setTaxAmount(request.getTaxAmount() != null ? request.getTaxAmount() : BigDecimal.ZERO);
        
        // Calculate net salary
        BigDecimal grossSalary = payroll.getBasicSalary()
                .add(payroll.getAllowances())
                .add(payroll.getOvertimePay());
        BigDecimal netSalary = grossSalary
                .subtract(payroll.getDeductions())
                .subtract(payroll.getTaxAmount());
        payroll.setNetSalary(netSalary);
        
        payroll.setStatus(Payroll.PaymentStatus.PENDING);
        payroll.setGeneratedAt(LocalDateTime.now());
        payroll.setNotes(request.getNotes());
        
        if (processedById != null) {
            User processor = userRepository.findById(processedById)
                    .orElseThrow(() -> new RuntimeException("Processor not found"));
            payroll.setProcessedBy(processor);
        }
        
        return payrollRepository.save(payroll);
    }
    
    public List<Payroll> getAllPayrolls() {
        return payrollRepository.findAllByOrderByGeneratedAtDesc();
    }
    
    public List<Payroll> getEmployeePayrolls(Long employeeId) {
        User employee = userRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return payrollRepository.findByEmployeeOrderByPayYearDescPayMonthDesc(employee);
    }
    
    public List<Payroll> getPayrollsByPeriod(Integer month, Integer year) {
        return payrollRepository.findByPayMonthAndPayYear(month, year);
    }
    
    public Payroll getPayrollById(Long id) {
        return payrollRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payroll not found"));
    }
    
    @Transactional
    public Payroll updatePayrollStatus(Long payrollId, Payroll.PaymentStatus status, String paymentReference) {
        Payroll payroll = getPayrollById(payrollId);
        payroll.setStatus(status);
        
        if (status == Payroll.PaymentStatus.PAID) {
            payroll.setPaymentDate(LocalDate.now());
            payroll.setPaymentReference(paymentReference);
            payroll.setProcessedAt(LocalDateTime.now());
        }
        
        return payrollRepository.save(payroll);
    }
    
    public Long countByStatus(Payroll.PaymentStatus status) {
        return payrollRepository.countByStatus(status);
    }
}
