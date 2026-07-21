package com.steelcare.pmms.service.impl;

import com.steelcare.pmms.dto.MachineDto;
import com.steelcare.pmms.entity.Machine;
import com.steelcare.pmms.exception.DuplicateMachineException;
import com.steelcare.pmms.exception.ResourceNotFoundException;
import com.steelcare.pmms.mapper.MachineMapper;
import com.steelcare.pmms.repository.MachineRepository;
import com.steelcare.pmms.service.MachineService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MachineServiceImpl implements MachineService {

    private final MachineRepository machineRepository;

    public MachineServiceImpl(MachineRepository machineRepository) {
        this.machineRepository = machineRepository;
    }

    @Override
    public List<MachineDto> getAllMachines(String query) {
        List<Machine> machines;
        if (query == null || query.trim().isEmpty()) {
            machines = machineRepository.findAll();
        } else {
            machines = machineRepository.searchMachines(query.trim());
        }
        return machines.stream()
                .map(MachineMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public MachineDto getMachineById(Long id) {
        Machine machine = machineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Machine not found with id: " + id));
        return MachineMapper.toDto(machine);
    }

    @Override
    public MachineDto addMachine(MachineDto machineDto) {
        if (machineRepository.existsByMachineCode(machineDto.getMachineCode())) {
            throw new DuplicateMachineException("Machine code already exists: " + machineDto.getMachineCode());
        }
        Machine machine = MachineMapper.toEntity(machineDto);
        Machine savedMachine = machineRepository.save(machine);
        return MachineMapper.toDto(savedMachine);
    }

    @Override
    public MachineDto updateMachine(Long id, MachineDto machineDto) {
        Machine existingMachine = machineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Machine not found with id: " + id));

        // Check if machine code has changed and if the new code is already used by another machine
        if (!existingMachine.getMachineCode().equalsIgnoreCase(machineDto.getMachineCode()) &&
                machineRepository.existsByMachineCode(machineDto.getMachineCode())) {
            throw new DuplicateMachineException("Machine code already exists: " + machineDto.getMachineCode());
        }

        existingMachine.setMachineCode(machineDto.getMachineCode());
        existingMachine.setMachineName(machineDto.getMachineName());
        existingMachine.setDepartment(machineDto.getDepartment());
        existingMachine.setLocation(machineDto.getLocation());
        existingMachine.setManufacturer(machineDto.getManufacturer());
        existingMachine.setInstallationDate(machineDto.getInstallationDate());
        existingMachine.setRuntimeHours(machineDto.getRuntimeHours());
        existingMachine.setStatus(machineDto.getStatus());
        existingMachine.setLastMaintenanceDate(machineDto.getLastMaintenanceDate());
        existingMachine.setNextMaintenanceDate(machineDto.getNextMaintenanceDate());

        Machine updatedMachine = machineRepository.save(existingMachine);
        return MachineMapper.toDto(updatedMachine);
    }

    @Override
    public void deleteMachine(Long id) {
        if (!machineRepository.existsById(id)) {
            throw new ResourceNotFoundException("Machine not found with id: " + id);
        }
        machineRepository.deleteById(id);
    }
}
