package et.gov.police.repository;

import et.gov.police.model.Payroll;
import et.gov.police.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    
    List<Payroll> findByEmployee(User employee);
    
    List<Payroll> findByEmployeeOrderByPayYearDescPayMonthDesc(User employee);
    
    Optional<Payroll> findByEmployeeAndPayMonthAndPayYear(User employee, Integer payMonth, Integer payYear);
    
    List<Payroll> findByPayMonthAndPayYear(Integer payMonth, Integer payYear);
    
    List<Payroll> findByStatus(Payroll.PaymentStatus status);
    
    List<Payroll> findAllByOrderByGeneratedAtDesc();
    
    Long countByStatus(Payroll.PaymentStatus status);
}
