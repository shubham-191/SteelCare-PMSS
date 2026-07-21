package com.steelcare.pmms.service.impl;

import com.steelcare.pmms.dto.MaintenanceRequestDto;
import com.steelcare.pmms.dto.MaintenanceResponseDto;
import com.steelcare.pmms.entity.*;
import com.steelcare.pmms.exception.ResourceNotFoundException;
import com.steelcare.pmms.mapper.MaintenanceMapper;
import com.steelcare.pmms.repository.EmployeeRepository;
import com.steelcare.pmms.repository.MachineRepository;
import com.steelcare.pmms.repository.MaintenanceRepository;
import com.steelcare.pmms.repository.NotificationRepository;
import com.steelcare.pmms.service.MaintenanceService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MaintenanceServiceImpl implements MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;
    private final MachineRepository machineRepository;
    private final EmployeeRepository employeeRepository;
    private final NotificationRepository notificationRepository;

    public MaintenanceServiceImpl(
            MaintenanceRepository maintenanceRepository,
            MachineRepository machineRepository,
            EmployeeRepository employeeRepository,
            NotificationRepository notificationRepository
    ) {
        this.maintenanceRepository = maintenanceRepository;
        this.machineRepository = machineRepository;
        this.employeeRepository = employeeRepository;
        this.notificationRepository = notificationRepository;
    }

    @Override
    public List<MaintenanceResponseDto> getAllMaintenances(Long engineerId) {
        List<Maintenance> list;
        if (engineerId == null) {
            list = maintenanceRepository.findAll();
        } else {
            list = maintenanceRepository.findByEngineerId(engineerId);
        }
        return list.stream()
                .map(MaintenanceMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public MaintenanceResponseDto getMaintenanceById(Long id) {
        Maintenance maintenance = maintenanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance task not found with id: " + id));
        return MaintenanceMapper.toDto(maintenance);
    }

    @Override
    public MaintenanceResponseDto createMaintenance(MaintenanceRequestDto requestDto) {
        Machine machine = machineRepository.findById(requestDto.getMachineId())
                .orElseThrow(() -> new ResourceNotFoundException("Machine not found with id: " + requestDto.getMachineId()));
        
        Employee engineer = employeeRepository.findById(requestDto.getEngineerId())
                .orElseThrow(() -> new ResourceNotFoundException("Engineer not found with id: " + requestDto.getEngineerId()));
        
        if (engineer.getRole() != Role.ENGINEER) {
            throw new IllegalArgumentException("Employee must be an ENGINEER role to be assigned maintenance");
        }

        Maintenance maintenance = MaintenanceMapper.toEntity(requestDto, machine, engineer);
        Maintenance saved = maintenanceRepository.save(maintenance);

        // Generate assignment notification
        String msg = String.format("New maintenance task assigned to %s for machine %s (%s)", 
                engineer.getName(), machine.getMachineName(), machine.getMachineCode());
        Notification notification = Notification.builder()
                .message(msg)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        notificationRepository.save(notification);

        return MaintenanceMapper.toDto(saved);
    }

    @Override
    public MaintenanceResponseDto updateMaintenance(Long id, MaintenanceRequestDto requestDto) {
        Maintenance maintenance = maintenanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance task not found with id: " + id));

        Machine machine = machineRepository.findById(requestDto.getMachineId())
                .orElseThrow(() -> new ResourceNotFoundException("Machine not found with id: " + requestDto.getMachineId()));

        Employee engineer = employeeRepository.findById(requestDto.getEngineerId())
                .orElseThrow(() -> new ResourceNotFoundException("Engineer not found with id: " + requestDto.getEngineerId()));

        if (engineer.getRole() != Role.ENGINEER) {
            throw new IllegalArgumentException("Employee must be an ENGINEER role to be assigned maintenance");
        }

        // Detect status transition to update machine status/dates
        MaintenanceStatus newStatus = requestDto.getStatus();
        if (newStatus != null && newStatus != maintenance.getStatus()) {
            if (newStatus == MaintenanceStatus.IN_PROGRESS) {
                machine.setStatus(MachineStatus.UNDER_MAINTENANCE);
            } else if (newStatus == MaintenanceStatus.COMPLETED) {
                machine.setStatus(MachineStatus.RUNNING);
                LocalDate completionDate = requestDto.getCompletedDate() != null ? requestDto.getCompletedDate() : LocalDate.now();
                maintenance.setCompletedDate(completionDate);
                machine.setLastMaintenanceDate(completionDate);
                // Automatically set next maintenance date in 30 days
                machine.setNextMaintenanceDate(completionDate.plusDays(30));
                machineRepository.save(machine);
            }
        }

        maintenance.setMachine(machine);
        maintenance.setEngineer(engineer);
        maintenance.setMaintenanceType(requestDto.getMaintenanceType());
        maintenance.setDescription(requestDto.getDescription());
        maintenance.setScheduledDate(requestDto.getScheduledDate());
        if (requestDto.getCompletedDate() != null) {
            maintenance.setCompletedDate(requestDto.getCompletedDate());
        }
        if (newStatus != null) {
            maintenance.setStatus(newStatus);
        }
        maintenance.setRemarks(requestDto.getRemarks());

        Maintenance updated = maintenanceRepository.save(maintenance);
        return MaintenanceMapper.toDto(updated);
    }

    @Override
    public void deleteMaintenance(Long id) {
        if (!maintenanceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Maintenance task not found with id: " + id);
        }
        maintenanceRepository.deleteById(id);
    }

    @Override
    public List<MaintenanceResponseDto> getOverdueMaintenances() {
        List<Maintenance> list = maintenanceRepository.findByStatusNotAndScheduledDateBefore(
                MaintenanceStatus.COMPLETED, LocalDate.now());
        return list.stream()
                .map(MaintenanceMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<MaintenanceResponseDto> getMaintenanceHistoryForMachine(Long machineId) {
        List<Maintenance> list = maintenanceRepository.findByMachineId(machineId);
        return list.stream()
                .map(MaintenanceMapper::toDto)
                .sorted((a, b) -> b.getScheduledDate().compareTo(a.getScheduledDate())) // Sort latest first
                .collect(Collectors.toList());
    }
}
