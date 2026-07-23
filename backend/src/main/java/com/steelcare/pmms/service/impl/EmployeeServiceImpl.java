package com.steelcare.pmms.service.impl;

import com.steelcare.pmms.dto.AuthResponse;
import com.steelcare.pmms.dto.LoginRequest;
import com.steelcare.pmms.dto.RegisterRequest;
import com.steelcare.pmms.entity.Employee;
import com.steelcare.pmms.entity.Role;
import com.steelcare.pmms.exception.ResourceNotFoundException;
import com.steelcare.pmms.repository.EmployeeRepository;
import com.steelcare.pmms.security.JwtUtils;
import com.steelcare.pmms.service.EmployeeService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    public EmployeeServiceImpl(
            EmployeeRepository employeeRepository,
            PasswordEncoder passwordEncoder,
            JwtUtils jwtUtils,
            AuthenticationManager authenticationManager
    ) {
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        Employee employee = employeeRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));
        
        String jwtToken = jwtUtils.generateToken(employee);
        
        return AuthResponse.builder()
                .token(jwtToken)
                .id(employee.getId())
                .name(employee.getName())
                .email(employee.getEmail())
                .role(employee.getRole())
                .phoneNumber(employee.getPhoneNumber())
                .build();
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (request.getRole() == Role.ADMIN) {
            throw new IllegalArgumentException("Registration of Administrator accounts is prohibited.");
        }
        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + request.getEmail());
        }

        Employee employee = Employee.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .phoneNumber(request.getPhoneNumber())
                .build();

        employeeRepository.save(employee);
        
        String jwtToken = jwtUtils.generateToken(employee);

        return AuthResponse.builder()
                .token(jwtToken)
                .id(employee.getId())
                .name(employee.getName())
                .email(employee.getEmail())
                .role(employee.getRole())
                .phoneNumber(employee.getPhoneNumber())
                .build();
    }

    @Override
    public List<Employee> getEngineers() {
        return employeeRepository.findByRole(Role.ENGINEER);
    }

    @Override
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    }
}
