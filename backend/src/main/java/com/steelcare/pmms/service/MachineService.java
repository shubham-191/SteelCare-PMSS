package com.steelcare.pmms.service;

import com.steelcare.pmms.dto.MachineDto;

import java.util.List;

public interface MachineService {
    List<MachineDto> getAllMachines(String query);
    MachineDto getMachineById(Long id);
    MachineDto addMachine(MachineDto machineDto);
    MachineDto updateMachine(Long id, MachineDto machineDto);
    void deleteMachine(Long id);
}
