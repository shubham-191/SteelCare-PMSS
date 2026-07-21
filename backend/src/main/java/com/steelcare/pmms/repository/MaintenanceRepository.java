package com.steelcare.pmms.repository;

import com.steelcare.pmms.entity.Maintenance;
import com.steelcare.pmms.entity.MaintenanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {
    List<Maintenance> findByEngineerId(Long engineerId);
    List<Maintenance> findByMachineId(Long machineId);
    List<Maintenance> findByStatus(MaintenanceStatus status);
    
    // Find overdue maintenance tasks (scheduled date is before input date and status is not COMPLETED)
    List<Maintenance> findByStatusNotAndScheduledDateBefore(MaintenanceStatus status, LocalDate date);
    
    long countByStatus(MaintenanceStatus status);
    
    @Query("SELECT COUNT(m) FROM Maintenance m WHERE m.status != 'COMPLETED' AND m.scheduledDate < :date")
    long countOverdueMaintenance(@Param("date") LocalDate date);
}
