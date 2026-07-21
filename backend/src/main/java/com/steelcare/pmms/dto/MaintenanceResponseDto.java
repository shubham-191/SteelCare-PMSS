package com.steelcare.pmms.dto;

import com.steelcare.pmms.entity.MaintenanceStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceResponseDto {
    private Long id;
    private Long machineId;
    private String machineCode;
    private String machineName;
    private Long engineerId;
    private String engineerName;
    private String maintenanceType;
    private String description;
    private LocalDate scheduledDate;
    private LocalDate completedDate;
    private MaintenanceStatus status;
    private String remarks;
}
