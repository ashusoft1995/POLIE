package et.gov.police.service;

import et.gov.police.dto.EmployeeRegistrationRequest;
import et.gov.police.model.Employee;
import et.gov.police.model.Role;
import et.gov.police.model.User;
import et.gov.police.repository.EmployeeRepository;
import et.gov.police.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class EmployeeService {

    private final UserRepository     userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder    passwordEncoder;

    public EmployeeService(UserRepository userRepository,
                           EmployeeRepository employeeRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository     = userRepository;
        this.employeeRepository = employeeRepository;
        this.passwordEncoder    = passwordEncoder;
    }

    /**
     * Registers a new employee:
     *  1. Creates a User account (login credentials).
     *  2. Creates an Employee record (HR details) linked to the User.
     */
    @Transactional
    public User registerEmployee(EmployeeRegistrationRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent())
            throw new RuntimeException("Username already exists");
        if (userRepository.findByEmail(request.getEmail()).isPresent())
            throw new RuntimeException("Email already exists");

        // 1 — Create User account
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(Role.valueOf(request.getRole()))
                .badge(request.getBadge())
                .rank(request.getRank())
                .enabled(true)
                .accountLocked(false)
                .build();
        user = userRepository.save(user);

        // 2 — Create Employee HR record
        Employee emp = new Employee();
        emp.setUser(user);
        emp.setFullName(request.getFullName());
        emp.setBadgeNumber(request.getBadge() != null ? request.getBadge() : "");
        emp.setRank(request.getRank());
        emp.setEmail(request.getEmail());
        emp.setEmploymentStatus(Employee.EmploymentStatus.ACTIVE);
        employeeRepository.save(emp);

        return user;
    }

    public List<User>     getAllEmployees()             { return userRepository.findAll(); }
    public List<User>     getEmployeesByRole(Role role) { return userRepository.findByRole(role); }
    public User           getEmployeeById(Long id)      { return userRepository.findById(id).orElseThrow(() -> new RuntimeException("Employee not found")); }
    public Long           countAll()                    { return userRepository.count(); }
    public Long           countByRole(Role role)        { return (long) userRepository.findByRole(role).size(); }

    @Transactional
    public User updateEmployee(Long id, EmployeeRegistrationRequest request) {
        User employee = getEmployeeById(id);
        if (request.getFullName() != null) employee.setFullName(request.getFullName());
        if (request.getEmail() != null && !request.getEmail().equals(employee.getEmail())) {
            if (userRepository.findByEmail(request.getEmail()).isPresent())
                throw new RuntimeException("Email already in use");
            employee.setEmail(request.getEmail());
        }
        if (request.getRole()     != null) employee.setRole(Role.valueOf(request.getRole()));
        if (request.getBadge()    != null) employee.setBadge(request.getBadge());
        if (request.getRank()     != null) employee.setRank(request.getRank());
        if (request.getPassword() != null && !request.getPassword().isEmpty())
            employee.setPassword(passwordEncoder.encode(request.getPassword()));

        // Also sync Employee HR record if it exists
        employeeRepository.findByUserId(employee.getId()).ifPresent(emp -> {
            if (request.getFullName() != null) emp.setFullName(request.getFullName());
            if (request.getBadge()    != null) emp.setBadgeNumber(request.getBadge());
            if (request.getRank()     != null) emp.setRank(request.getRank());
            if (request.getEmail()    != null) emp.setEmail(request.getEmail());
            employeeRepository.save(emp);
        });

        return userRepository.save(employee);
    }

    @Transactional
    public void toggleEmployeeStatus(Long id) {
        User employee = getEmployeeById(id);
        employee.setEnabled(!employee.isEnabled());
        userRepository.save(employee);

        // Also update Employee HR status
        employeeRepository.findByUserId(id).ifPresent(emp -> {
            emp.setEmploymentStatus(employee.isEnabled()
                ? Employee.EmploymentStatus.ACTIVE
                : Employee.EmploymentStatus.SUSPENDED);
            employeeRepository.save(emp);
        });
    }

    @Transactional
    public void deleteEmployee(Long id) {
        // Remove HR record first (FK constraint)
        employeeRepository.findByUserId(id).ifPresent(employeeRepository::delete);
        userRepository.delete(getEmployeeById(id));
    }
}
