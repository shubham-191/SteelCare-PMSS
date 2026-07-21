package com.steelcare.pmms.mapper;

import com.steelcare.pmms.dto.MaintenanceRequestDto;
import com.steelcare.pmms.dto.MaintenanceResponseDto;
import com.steelcare.pmms.entity.Employee;
import com.steelcare.pmms.entity.Machine;
import com.steelcare.pmms.entity.Maintenance;
import com.steelcare.pmms.entity.MaintenanceStatus;

public class MaintenanceMapper {

    public static MaintenanceResponseDto toDto(Maintenance maintenance) {
        if (maintenance == null) {
            return null;
        }
        return MaintenanceResponseDto.builder()
                .id(maintenance.getId())
                .machineId(maintenance.getMachine().getId())
                .machineCode(maintenance.getMachine().getMachineCode())
                .machineName(maintenance.getMachine().getMachineName())
                .engineerId(maintenance.getEngineer().getId())
                .engineerName(maintenance.getEngineer().getName())
                .maintenanceType(maintenance.getMaintenanceType())
                .description(maintenance.getDescription())
                .scheduledDate(maintenance.getScheduledDate())
                .completedDate(maintenance.getCompletedDate())
                .status(maintenance.getStatus())
                .remarks(maintenance.getRemarks())
                .build();
    }

    public static Maintenance toEntity(MaintenanceRequestDto dto, Machine machine, Employee engineer) {
        if (dto == null) {
            return null;
        }
        return Maintenance.builder()
                .machine(machine)
                .engineer(engineer)
                .maintenanceType(dto.getMaintenanceType())
                .description(dto.getDescription())
                .scheduledDate(dto.getScheduledDate())
                .completedDate(dto.getCompletedDate())
                .status(dto.getStatus() != null ? dto.getStatus() : MaintenanceStatus.PENDING)
                .remarks(dto.getRemarks())
                .build();
    }
}
