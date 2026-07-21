package com.steelcare.pmms.repository;

import com.steelcare.pmms.entity.Machine;
import com.steelcare.pmms.entity.MachineStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MachineRepository extends JpaRepository<Machine, Long> {
    Optional<Machine> findByMachineCode(String machineCode);
    boolean existsByMachineCode(String machineCode);
    long countByStatus(MachineStatus status);
    
    @Query("SELECT m FROM Machine m WHERE " +
           "LOWER(m.machineCode) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.machineName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.department) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.location) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Machine> searchMachines(@Param("query") String query);
}
