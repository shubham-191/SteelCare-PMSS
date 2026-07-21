package com.steelcare.pmms.controller;

import com.steelcare.pmms.dto.MachineDto;
import com.steelcare.pmms.service.MachineService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/machines")
@Tag(name = "Machine Management", description = "Endpoints for managing shopfloor machines (Admin CRUD, Engineer View)")
public class MachineController {

    private final MachineService machineService;

    public MachineController(MachineService machineService) {
        this.machineService = machineService;
    }

    @GetMapping
    @Operation(summary = "Get list of all machines, with optional search query")
    public ResponseEntity<List<MachineDto>> getAllMachines(@RequestParam(value = "search", required = false) String search) {
        return ResponseEntity.ok(machineService.getAllMachines(search));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get details of a specific machine by id")
    public ResponseEntity<MachineDto> getMachineById(@PathVariable Long id) {
        return ResponseEntity.ok(machineService.getMachineById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Add a new machine (Admin only)")
    public ResponseEntity<MachineDto> addMachine(@Valid @RequestBody MachineDto machineDto) {
        return new ResponseEntity<>(machineService.addMachine(machineDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update details of an existing machine (Admin only)")
    public ResponseEntity<MachineDto> updateMachine(@PathVariable Long id, @Valid @RequestBody MachineDto machineDto) {
        return ResponseEntity.ok(machineService.updateMachine(id, machineDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a machine by id (Admin only)")
    public ResponseEntity<Void> deleteMachine(@PathVariable Long id) {
        machineService.deleteMachine(id);
        return ResponseEntity.noContent().build();
    }
}
