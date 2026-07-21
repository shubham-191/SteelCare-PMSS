package com.steelcare.pmms.service.impl;

import com.steelcare.pmms.dto.DashboardDto;
import com.steelcare.pmms.dto.MaintenanceResponseDto;
import com.steelcare.pmms.entity.MachineStatus;
import com.steelcare.pmms.entity.Maintenance;
import com.steelcare.pmms.entity.MaintenanceStatus;
import com.steelcare.pmms.mapper.MaintenanceMapper;
import com.steelcare.pmms.repository.MachineRepository;
import com.steelcare.pmms.repository.MaintenanceRepository;
import com.steelcare.pmms.service.DashboardService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final MachineRepository machineRepository;
    private final MaintenanceRepository maintenanceRepository;

    public DashboardServiceImpl(MachineRepository machineRepository, MaintenanceRepository maintenanceRepository) {
        this.machineRepository = machineRepository;
        this.maintenanceRepository = maintenanceRepository;
    }

    @Override
    public DashboardDto getDashboardData() {
        LocalDate today = LocalDate.now();

        // 1. Cards Info
        long totalMachines = machineRepository.count();
        long runningMachines = machineRepository.countByStatus(MachineStatus.RUNNING);
        long pendingMaintenance = maintenanceRepository.countByStatus(MaintenanceStatus.PENDING) + 
                                  maintenanceRepository.countByStatus(MaintenanceStatus.IN_PROGRESS);
        long completedMaintenance = maintenanceRepository.countByStatus(MaintenanceStatus.COMPLETED);
        long overdueMaintenance = maintenanceRepository.countOverdueMaintenance(today);

        // 2. Machine Status Distribution
        Map<String, Long> statusDistribution = new HashMap<>();
        statusDistribution.put(MachineStatus.RUNNING.name(), runningMachines);
        statusDistribution.put(MachineStatus.DOWN.name(), machineRepository.countByStatus(MachineStatus.DOWN));
        statusDistribution.put(MachineStatus.UNDER_MAINTENANCE.name(), machineRepository.countByStatus(MachineStatus.UNDER_MAINTENANCE));

        // 3. Monthly Maintenance Trend (Last 6 Months)
        List<DashboardDto.MonthlyTrendDto> trend = new ArrayList<>();
        Map<String, DashboardDto.MonthlyTrendDto> trendMap = new LinkedHashMap<>();
        
        for (int i = 5; i >= 0; i--) {
            LocalDate targetDate = today.minusMonths(i);
            String monthKey = targetDate.getYear() + "-" + String.format("%02d", targetDate.getMonthValue());
            String displayName = targetDate.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + " " + targetDate.getYear();
            
            DashboardDto.MonthlyTrendDto trendDto = DashboardDto.MonthlyTrendDto.builder()
                    .month(displayName)
                    .completed(0L)
                    .pending(0L)
                    .overdue(0L)
                    .build();
            trendMap.put(monthKey, trendDto);
            trend.add(trendDto);
        }

        List<Maintenance> allMaintenances = maintenanceRepository.findAll();
        for (Maintenance m : allMaintenances) {
            LocalDate date = m.getScheduledDate();
            String monthKey = date.getYear() + "-" + String.format("%02d", date.getMonthValue());
            
            if (trendMap.containsKey(monthKey)) {
                DashboardDto.MonthlyTrendDto trendDto = trendMap.get(monthKey);
                if (m.getStatus() == MaintenanceStatus.COMPLETED) {
                    trendDto.setCompleted(trendDto.getCompleted() + 1);
                } else if (date.isBefore(today)) {
                    trendDto.setOverdue(trendDto.getOverdue() + 1);
                } else {
                    trendDto.setPending(trendDto.getPending() + 1);
                }
            }
        }

        // 4. Recent Activities (Limit to 10 latest tasks, sorted by ID/Date desc)
        List<MaintenanceResponseDto> recentActivities = allMaintenances.stream()
                .sorted((a, b) -> b.getId().compareTo(a.getId()))
                .limit(10)
                .map(MaintenanceMapper::toDto)
                .collect(Collectors.toList());

        return DashboardDto.builder()
                .totalMachines(totalMachines)
                .runningMachines(runningMachines)
                .pendingMaintenance(pendingMaintenance)
                .completedMaintenance(completedMaintenance)
                .overdueMaintenance(overdueMaintenance)
                .machineStatusDistribution(statusDistribution)
                .monthlyMaintenanceTrend(trend)
                .recentActivities(recentActivities)
                .build();
    }
}
