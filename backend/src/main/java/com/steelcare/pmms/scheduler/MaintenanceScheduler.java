package com.steelcare.pmms.scheduler;

import com.steelcare.pmms.entity.Machine;
import com.steelcare.pmms.entity.Maintenance;
import com.steelcare.pmms.entity.MaintenanceStatus;
import com.steelcare.pmms.repository.MachineRepository;
import com.steelcare.pmms.repository.MaintenanceRepository;
import com.steelcare.pmms.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class MaintenanceScheduler {

    private static final Logger log = LoggerFactory.getLogger(MaintenanceScheduler.class);

    private final MachineRepository machineRepository;
    private final MaintenanceRepository maintenanceRepository;
    private final NotificationService notificationService;

    public MaintenanceScheduler(
            MachineRepository machineRepository,
            MaintenanceRepository maintenanceRepository,
            NotificationService notificationService
    ) {
        this.machineRepository = machineRepository;
        this.maintenanceRepository = maintenanceRepository;
        this.notificationService = notificationService;
    }

    // Executes once every day at midnight: "0 0 0 * * ?"
    // For verification purposes, we also run it initially after startup or can let it run every hour
    @Scheduled(cron = "0 0 0 * * ?")
    public void checkOverdueMaintenance() {
        log.info("Starting scheduled scan for overdue maintenance tasks...");
        LocalDate today = LocalDate.now();

        // 1. Check all machines where nextMaintenanceDate is past today
        List<Machine> machines = machineRepository.findAll();
        for (Machine machine : machines) {
            if (machine.getNextMaintenanceDate() != null && machine.getNextMaintenanceDate().isBefore(today)) {
                String message = String.format("Machine '%s' (%s) is overdue for preventive maintenance since %s.",
                        machine.getMachineName(), machine.getMachineCode(), machine.getNextMaintenanceDate());
                notificationService.createNotification(message);
            }
        }

        // 2. Check all pending or in-progress maintenance records where scheduledDate is past today
        List<Maintenance> overdueTasks = maintenanceRepository.findByStatusNotAndScheduledDateBefore(
                MaintenanceStatus.COMPLETED, today);
        for (Maintenance task : overdueTasks) {
            String message = String.format("Assigned maintenance task for machine '%s' (%s) scheduled on %s is OVERDUE.",
                    task.getMachine().getMachineName(), task.getMachine().getMachineCode(), task.getScheduledDate());
            notificationService.createNotification(message);
        }
        
        log.info("Scheduled scan completed.");
    }
}
