package com.steelcare.pmms.dto;

import com.steelcare.pmms.entity.MaintenanceStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceRequestDto {
    
    @NotNull(message = "Machine ID is mandatory")
    private Long machineId;
    
    @NotNull(message = "Engineer ID is mandatory")
    private Long engineerId;
    
    @NotBlank(message = "Maintenance type is mandatory")
    private String maintenanceType;
    
    @NotBlank(message = "Description is mandatory")
    private String description;
    
    @NotNull(message = "Scheduled date is mandatory")
    private LocalDate scheduledDate;
    
    private LocalDate completedDate;
    
    private MaintenanceStatus status; // defaults to PENDING in service
    
    private String remarks;
}
