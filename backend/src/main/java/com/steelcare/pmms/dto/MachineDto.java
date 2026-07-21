package com.steelcare.pmms.dto;

import com.steelcare.pmms.entity.MachineStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MachineDto {
    
    private Long id;
    
    @NotBlank(message = "Machine code is mandatory")
    private String machineCode;
    
    @NotBlank(message = "Machine name is mandatory")
    private String machineName;
    
    @NotBlank(message = "Department is mandatory")
    private String department;
    
    @NotBlank(message = "Location is mandatory")
    private String location;
    
    @NotBlank(message = "Manufacturer is mandatory")
    private String manufacturer;
    
    @NotNull(message = "Installation date is mandatory")
    private LocalDate installationDate;
    
    @NotNull(message = "Runtime hours is mandatory")
    @Min(value = 0, message = "Runtime hours cannot be negative")
    private Double runtimeHours;
    
    @NotNull(message = "Status is mandatory")
    private MachineStatus status;
    
    private LocalDate lastMaintenanceDate;
    
    private LocalDate nextMaintenanceDate;
}
