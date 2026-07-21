package com.steelcare.pmms.service;

import com.steelcare.pmms.dto.MaintenanceRequestDto;
import com.steelcare.pmms.dto.MaintenanceResponseDto;

import java.util.List;

public interface MaintenanceService {
    List<MaintenanceResponseDto> getAllMaintenances(Long engineerId);
    MaintenanceResponseDto getMaintenanceById(Long id);
    MaintenanceResponseDto createMaintenance(MaintenanceRequestDto requestDto);
    MaintenanceResponseDto updateMaintenance(Long id, MaintenanceRequestDto requestDto);
    void deleteMaintenance(Long id);
    List<MaintenanceResponseDto> getOverdueMaintenances();
    List<MaintenanceResponseDto> getMaintenanceHistoryForMachine(Long machineId);
}
