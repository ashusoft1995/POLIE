package et.gov.police.service;

import et.gov.police.dto.EmployeeRegistrationRequest;
import et.gov.police.model.Role;
import et.gov.police.model.User;
import et.gov.police.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EmployeeService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public EmployeeService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Transactional
    public User registerEmployee(EmployeeRegistrationRequest request) {
        // Check if username or email already exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        
        User employee = User.builder()
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
        
        return userRepository.save(employee);
    }
    
    public List<User> getAllEmployees() {
        return userRepository.findAll();
    }
    
    public List<User> getEmployeesByRole(Role role) {
        return userRepository.findByRole(role);
    }
    
    public User getEmployeeById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
    }
    
    @Transactional
    public User updateEmployee(Long id, EmployeeRegistrationRequest request) {
        User employee = getEmployeeById(id);
        
        if (request.getFullName() != null) {
            employee.setFullName(request.getFullName());
        }
        if (request.getEmail() != null && !request.getEmail().equals(employee.getEmail())) {
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new RuntimeException("Email already exists");
            }
            employee.setEmail(request.getEmail());
        }
        if (request.getRole() != null) {
            employee.setRole(Role.valueOf(request.getRole()));
        }
        if (request.getBadge() != null) {
            employee.setBadge(request.getBadge());
        }
        if (request.getRank() != null) {
            employee.setRank(request.getRank());
        }
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            employee.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        
        return userRepository.save(employee);
    }
    
    @Transactional
    public void toggleEmployeeStatus(Long id) {
        User employee = getEmployeeById(id);
        employee.setEnabled(!employee.isEnabled());
        userRepository.save(employee);
    }
    
    @Transactional
    public void deleteEmployee(Long id) {
        User employee = getEmployeeById(id);
        userRepository.delete(employee);
    }
    
    public Long countAll() {
        return userRepository.count();
    }
    
    public Long countByRole(Role role) {
        return (long) userRepository.findByRole(role).size();
    }
}
