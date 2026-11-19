package et.gov.police.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payrolls")
public class Payroll {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private User employee;
    
    @Column(nullable = false)
    private Integer payMonth;
    
    @Column(nullable = false)
    private Integer payYear;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal basicSalary;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal allowances = BigDecimal.ZERO;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal overtimePay = BigDecimal.ZERO;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal deductions = BigDecimal.ZERO;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal taxAmount = BigDecimal.ZERO;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal netSalary;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private PaymentStatus status = PaymentStatus.PENDING;
    
    private LocalDate paymentDate;
    
    @Column(nullable = false)
    private LocalDateTime generatedAt = LocalDateTime.now();
    
    @ManyToOne
    @JoinColumn(name = "processed_by_id")
    private User processedBy;
    
    private LocalDateTime processedAt;
    
    private String paymentReference;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    public enum PaymentStatus {
        PENDING,
        APPROVED,
        PAID,
        CANCELLED
    }
    
    // Constructors
    public Payroll() {}
    
    // Getters
    public Long getId() { return id; }
    public User getEmployee() { return employee; }
    public Integer getPayMonth() { return payMonth; }
    public Integer getPayYear() { return payYear; }
    public BigDecimal getBasicSalary() { return basicSalary; }
    public BigDecimal getAllowances() { return allowances; }
    public BigDecimal getOvertimePay() { return overtimePay; }
    public BigDecimal getDeductions() { return deductions; }
    public BigDecimal getTaxAmount() { return taxAmount; }
    public BigDecimal getNetSalary() { return netSalary; }
    public PaymentStatus getStatus() { return status; }
    public LocalDate getPaymentDate() { return paymentDate; }
    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public User getProcessedBy() { return processedBy; }
    public LocalDateTime getProcessedAt() { return processedAt; }
    public String getPaymentReference() { return paymentReference; }
    public String getNotes() { return notes; }
    
    // Setters
    public void setId(Long id) { this.id = id; }
    public void setEmployee(User employee) { this.employee = employee; }
    public void setPayMonth(Integer payMonth) { this.payMonth = payMonth; }
    public void setPayYear(Integer payYear) { this.payYear = payYear; }
    public void setBasicSalary(BigDecimal basicSalary) { this.basicSalary = basicSalary; }
    public void setAllowances(BigDecimal allowances) { this.allowances = allowances; }
    public void setOvertimePay(BigDecimal overtimePay) { this.overtimePay = overtimePay; }
    public void setDeductions(BigDecimal deductions) { this.deductions = deductions; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }
    public void setNetSalary(BigDecimal netSalary) { this.netSalary = netSalary; }
    public void setStatus(PaymentStatus status) { this.status = status; }
    public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }
    public void setProcessedBy(User processedBy) { this.processedBy = processedBy; }
    public void setProcessedAt(LocalDateTime processedAt) { this.processedAt = processedAt; }
    public void setPaymentReference(String paymentReference) { this.paymentReference = paymentReference; }
    public void setNotes(String notes) { this.notes = notes; }
}
