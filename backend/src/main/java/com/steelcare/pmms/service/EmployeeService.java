package com.steelcare.pmms.service;

import com.steelcare.pmms.dto.AuthResponse;
import com.steelcare.pmms.dto.LoginRequest;
import com.steelcare.pmms.dto.RegisterRequest;
import com.steelcare.pmms.entity.Employee;

import java.util.List;

public interface EmployeeService {
    AuthResponse login(LoginRequest request);
    AuthResponse register(RegisterRequest request);
    List<Employee> getEngineers();
    Employee getEmployeeById(Long id);
}
