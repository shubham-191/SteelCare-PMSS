package com.steelcare.pmms.controller;

import com.steelcare.pmms.dto.AuthResponse;
import com.steelcare.pmms.dto.LoginRequest;
import com.steelcare.pmms.dto.RegisterRequest;
import com.steelcare.pmms.entity.Employee;
import com.steelcare.pmms.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Endpoints for user authentication and registration")
public class AuthController {

    private final EmployeeService employeeService;

    public AuthController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and return JWT token")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(employeeService.login(request));
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user (ADMIN or ENGINEER)")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(employeeService.register(request));
    }

    @GetMapping("/engineers")
    @Operation(summary = "Get list of all registered engineers")
    public ResponseEntity<List<Employee>> getEngineers() {
        return ResponseEntity.ok(employeeService.getEngineers());
    }
}
