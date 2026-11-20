package et.gov.police.repository;

import et.gov.police.model.Employee;
import et.gov.police.model.Employee.EmploymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Optional<Employee> findByBadgeNumber(String badgeNumber);

    Optional<Employee> findByNationalId(String nationalId);

    Optional<Employee> findByUserId(Long userId);

    List<Employee> findByDepartment(String department);

    List<Employee> findByEmploymentStatus(EmploymentStatus status);

    List<Employee> findByDepartmentAndEmploymentStatus(String department, EmploymentStatus status);

    boolean existsByBadgeNumber(String badgeNumber);

    boolean existsByNationalId(String nationalId);

    long countByEmploymentStatus(EmploymentStatus status);

    long countByDepartment(String department);
}
