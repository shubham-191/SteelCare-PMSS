package com.steelcare.pmms.controller;

import com.steelcare.pmms.dto.MaintenanceRequestDto;
import com.steelcare.pmms.dto.MaintenanceResponseDto;
import com.steelcare.pmms.entity.Employee;
import com.steelcare.pmms.entity.Role;
import com.steelcare.pmms.service.MaintenanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/maintenance")
@Tag(name = "Maintenance Management", description = "Endpoints for scheduling, assigning, and updating preventive maintenance tasks")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @GetMapping
    @Operation(summary = "Get all maintenance tasks (Admins see all; Engineers see only their assigned tasks)")
    public ResponseEntity<List<MaintenanceResponseDto>> getAllMaintenances(@AuthenticationPrincipal Employee currentUser) {
        if (currentUser.getRole() == Role.ENGINEER) {
            return ResponseEntity.ok(maintenanceService.getAllMaintenances(currentUser.getId()));
        }
        return ResponseEntity.ok(maintenanceService.getAllMaintenances(null));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get details of a specific maintenance task by id")
    public ResponseEntity<MaintenanceResponseDto> getMaintenanceById(@PathVariable Long id) {
        return ResponseEntity.ok(maintenanceService.getMaintenanceById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @Operation(summary = "Create a new maintenance task / schedule maintenance (Admin and Employee only)")
    public ResponseEntity<MaintenanceResponseDto> createMaintenance(@Valid @RequestBody MaintenanceRequestDto requestDto) {
        return new ResponseEntity<>(maintenanceService.createMaintenance(requestDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing maintenance task (Admin can modify details; Engineer can update status and remarks)")
    public ResponseEntity<MaintenanceResponseDto> updateMaintenance(
            @PathVariable Long id, 
            @Valid @RequestBody MaintenanceRequestDto requestDto,
            @AuthenticationPrincipal Employee currentUser
    ) {
        // If the user is an ENGINEER, verify the task is assigned to them
        if (currentUser.getRole() == Role.ENGINEER) {
            MaintenanceResponseDto existing = maintenanceService.getMaintenanceById(id);
            if (!existing.getEngineerId().equals(currentUser.getId())) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
            // Force engineer restrictions: can only update status/remarks of their own assignment
            requestDto.setMachineId(existing.getMachineId());
            requestDto.setEngineerId(existing.getEngineerId());
            requestDto.setMaintenanceType(existing.getMaintenanceType());
            requestDto.setDescription(existing.getDescription());
            requestDto.setScheduledDate(existing.getScheduledDate());
        }
        
        return ResponseEntity.ok(maintenanceService.updateMaintenance(id, requestDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a maintenance task (Admin only)")
    public ResponseEntity<Void> deleteMaintenance(@PathVariable Long id) {
        maintenanceService.deleteMaintenance(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/overdue")
    @Operation(summary = "Get list of all overdue maintenance tasks")
    public ResponseEntity<List<MaintenanceResponseDto>> getOverdueMaintenances() {
        return ResponseEntity.ok(maintenanceService.getOverdueMaintenances());
    }

    @GetMapping("/machine/{machineId}")
    @Operation(summary = "Get maintenance history for a specific machine")
    public ResponseEntity<List<MaintenanceResponseDto>> getMaintenanceHistory(@PathVariable Long machineId) {
        return ResponseEntity.ok(maintenanceService.getMaintenanceHistoryForMachine(machineId));
    }
}
