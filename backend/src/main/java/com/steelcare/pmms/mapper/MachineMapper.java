package com.steelcare.pmms.mapper;

import com.steelcare.pmms.dto.MachineDto;
import com.steelcare.pmms.entity.Machine;

public class MachineMapper {

    public static MachineDto toDto(Machine machine) {
        if (machine == null) {
            return null;
        }
        return MachineDto.builder()
                .id(machine.getId())
                .machineCode(machine.getMachineCode())
                .machineName(machine.getMachineName())
                .department(machine.getDepartment())
                .location(machine.getLocation())
                .manufacturer(machine.getManufacturer())
                .installationDate(machine.getInstallationDate())
                .runtimeHours(machine.getRuntimeHours())
                .status(machine.getStatus())
                .lastMaintenanceDate(machine.getLastMaintenanceDate())
                .nextMaintenanceDate(machine.getNextMaintenanceDate())
                .build();
    }

    public static Machine toEntity(MachineDto dto) {
        if (dto == null) {
            return null;
        }
        return Machine.builder()
                .id(dto.getId())
                .machineCode(dto.getMachineCode())
                .machineName(dto.getMachineName())
                .department(dto.getDepartment())
                .location(dto.getLocation())
                .manufacturer(dto.getManufacturer())
                .installationDate(dto.getInstallationDate())
                .runtimeHours(dto.getRuntimeHours())
                .status(dto.getStatus())
                .lastMaintenanceDate(dto.getLastMaintenanceDate())
                .nextMaintenanceDate(dto.getNextMaintenanceDate())
                .build();
    }
}
