package et.gov.police.dto;

import java.math.BigDecimal;

public class PayrollRequest {
    private Long employeeId;
    private Integer payMonth;
    private Integer payYear;
    private BigDecimal basicSalary;
    private BigDecimal allowances;
    private BigDecimal overtimePay;
    private BigDecimal deductions;
    private BigDecimal taxAmount;
    private String notes;

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
    
    public Integer getPayMonth() { return payMonth; }
    public void setPayMonth(Integer payMonth) { this.payMonth = payMonth; }
    
    public Integer getPayYear() { return payYear; }
    public void setPayYear(Integer payYear) { this.payYear = payYear; }
    
    public BigDecimal getBasicSalary() { return basicSalary; }
    public void setBasicSalary(BigDecimal basicSalary) { this.basicSalary = basicSalary; }
    
    public BigDecimal getAllowances() { return allowances; }
    public void setAllowances(BigDecimal allowances) { this.allowances = allowances; }
    
    public BigDecimal getOvertimePay() { return overtimePay; }
    public void setOvertimePay(BigDecimal overtimePay) { this.overtimePay = overtimePay; }
    
    public BigDecimal getDeductions() { return deductions; }
    public void setDeductions(BigDecimal deductions) { this.deductions = deductions; }
    
    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
