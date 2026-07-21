package com.steelcare.pmms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardDto {
    private Long totalMachines;
    private Long runningMachines;
    private Long pendingMaintenance;
    private Long completedMaintenance;
    private Long overdueMaintenance;
    
    private Map<String, Long> machineStatusDistribution;
    private List<MonthlyTrendDto> monthlyMaintenanceTrend;
    private List<MaintenanceResponseDto> recentActivities;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MonthlyTrendDto {
        private String month; // e.g. "Jan", "Feb", "2026-07"
        private Long completed;
        private Long pending;
        private Long overdue;
    }
}
