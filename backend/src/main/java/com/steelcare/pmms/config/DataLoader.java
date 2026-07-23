package com.steelcare.pmms.config;

import com.steelcare.pmms.entity.*;
import com.steelcare.pmms.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private final EmployeeRepository employeeRepository;
    private final MachineRepository machineRepository;
    private final MaintenanceRepository maintenanceRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(
            EmployeeRepository employeeRepository,
            MachineRepository machineRepository,
            MaintenanceRepository maintenanceRepository,
            NotificationRepository notificationRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.employeeRepository = employeeRepository;
        this.machineRepository = machineRepository;
        this.maintenanceRepository = maintenanceRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (employeeRepository.count() == 0) {
            System.out.println("No employees found. Seeding initial demo data...");

            // 1. Seed Employees
            Employee admin = Employee.builder()
                    .name("System Administrator")
                    .email("admin@steelcare.com")
                    .password(passwordEncoder.encode("password"))
                    .role(Role.ADMIN)
                    .phoneNumber("+91 99999 88888")
                    .build();

            Employee engineer1 = Employee.builder()
                    .name("Robert Downey")
                    .email("engineer1@steelcare.com")
                    .password(passwordEncoder.encode("password"))
                    .role(Role.ENGINEER)
                    .phoneNumber("+91 88888 77777")
                    .build();

            Employee engineer2 = Employee.builder()
                    .name("Sarah Connor")
                    .email("engineer2@steelcare.com")
                    .password(passwordEncoder.encode("password"))
                    .role(Role.ENGINEER)
                    .phoneNumber("+91 77777 66666")
                    .build();

            Employee employee = Employee.builder()
                    .name("Scheduler Employee")
                    .email("employee@steelcare.com")
                    .password(passwordEncoder.encode("password"))
                    .role(Role.EMPLOYEE)
                    .phoneNumber("+91 98765 43210")
                    .build();

            employeeRepository.saveAll(List.of(admin, engineer1, engineer2, employee));

            // 2. Seed Machines (from Excel)
            List<Machine> machinesList = List.of(
            Machine.builder()
                    .machineCode("LAB205-PC01")
                    .machineName("TSPCA18734")
                    .department("205 PLC Lab")
                    .location("Computer No. 1")
                    .manufacturer("RAM: 8 GB, Processor: N/A, Storage: 256 GB, OS: WINDOWS 10 PRO, Use: PROJECTOR")
                    .installationDate(LocalDate.of(2025, 3, 10))
                    .runtimeHours(100.0)
                    .status(MachineStatus.RUNNING)
                    .lastMaintenanceDate(LocalDate.of(2026, 6, 1))
                    .nextMaintenanceDate(LocalDate.of(2026, 8, 1))
                    .build(),
            Machine.builder()
                    .machineCode("LAB205-PC02")
                    .machineName("TSPCA19224")
                    .department("205 PLC Lab")
                    .location("Computer No. 2")
                    .manufacturer("RAM: connected to admin, Processor: N/A, Storage: connected to admin, OS: connected to admin, Use: connected to admin")
                    .installationDate(LocalDate.of(2025, 3, 10))
                    .runtimeHours(100.0)
                    .status(MachineStatus.RUNNING)
                    .lastMaintenanceDate(LocalDate.of(2026, 6, 1))
                    .nextMaintenanceDate(LocalDate.of(2026, 8, 1))
                    .build(),
            Machine.builder()
                    .machineCode("LAB205-PC03")
                    .machineName("WINCC3  W3")
                    .department("205 PLC Lab")
                    .location("Computer No. 3")
                    .manufacturer("RAM: 16GB, Processor: N/A, Storage: 512GB, OS: WINDOWS 11 PRO, Use: WINCC Panel")
                    .installationDate(LocalDate.of(2025, 3, 10))
                    .runtimeHours(100.0)
                    .status(MachineStatus.RUNNING)
                    .lastMaintenanceDate(LocalDate.of(2026, 6, 1))
                    .nextMaintenanceDate(LocalDate.of(2026, 8, 1))
                    .build(),
            Machine.builder()
                    .machineCode("LAB205-PC04")
                    .machineName("WINCC2 W2")
                    .department("205 PLC Lab")
                    .location("Computer No. 4")
                    .manufacturer("RAM: 16GB, Processor: N/A, Storage: 512GB, OS: WINDOWS 11 PRO, Use: WINCC Panel")
                    .installationDate(LocalDate.of(2025, 3, 10))
                    .runtimeHours(100.0)
                    .status(MachineStatus.RUNNING)
                    .lastMaintenanceDate(LocalDate.of(2026, 6, 1))
                    .nextMaintenanceDate(LocalDate.of(2026, 8, 1))
                    .build(),
            Machine.builder()
                    .machineCode("LAB205-PC05")
                    .machineName("WINCC1 W1")
                    .department("205 PLC Lab")
                    .location("Computer No. 5")
                    .manufacturer("RAM: 16GB, Processor: N/A, Storage: 512GB, OS: WINDOWS 11 PRO, Use: WINCC Panel")
                    .installationDate(LocalDate.of(2025, 3, 10))
                    .runtimeHours(100.0)
                    .status(MachineStatus.RUNNING)
                    .lastMaintenanceDate(LocalDate.of(2026, 6, 1))
                    .nextMaintenanceDate(LocalDate.of(2026, 8, 1))
                    .build(),
            Machine.builder()
                    .machineCode("LAB205-PC06")
                    .machineName("TSPCA18828")
                    .department("205 PLC Lab")
                    .location("Computer No. 6")
                    .manufacturer("RAM: 8GB, Processor: N/A, Storage: 256GB, OS: WINDOWS 10- PRO, Use: COMMAND CENTRE")
                    .installationDate(LocalDate.of(2025, 3, 10))
                    .runtimeHours(100.0)
                    .status(MachineStatus.RUNNING)
                    .lastMaintenanceDate(LocalDate.of(2026, 6, 1))
                    .nextMaintenanceDate(LocalDate.of(2026, 8, 1))
                    .build(),
            Machine.builder()
                    .machineCode("LAB205-PC07")
                    .machineName("TSPCA13971")
                    .department("205 PLC Lab")
                    .location("Computer No. 7")
                    .manufacturer("RAM: 8 GB, Processor: N/A, Storage: 301 GB, OS: WINDOWS 10 PRO, Use: N/A")
                    .installationDate(LocalDate.of(2025, 3, 10))
                    .runtimeHours(100.0)
                    .status(MachineStatus.RUNNING)
                    .lastMaintenanceDate(LocalDate.of(2026, 6, 1))
                    .nextMaintenanceDate(LocalDate.of(2026, 8, 1))
                    .build(),
            Machine.builder()
                    .machineCode("LAB205-PC08")
                    .machineName("ASCS1")
                    .department("205 PLC Lab")
                    .location("Computer No. 8")
                    .manufacturer("RAM: 8 GB, Processor: N/A, Storage: 301 GB, OS: WINDOWS 10 PRO, Use: CONTROL BUILDER ABB DCS 800xA")
                    .installationDate(LocalDate.of(2025, 3, 10))
                    .runtimeHours(100.0)
                    .status(MachineStatus.RUNNING)
                    .lastMaintenanceDate(LocalDate.of(2026, 6, 1))
                    .nextMaintenanceDate(LocalDate.of(2026, 8, 1))
                    .build(),
            Machine.builder()
                    .machineCode("LAB205-PC09")
                    .machineName("ASCS1")
                    .department("205 PLC Lab")
                    .location("Computer No. 9")
                    .manufacturer("RAM: 16GB, Processor: N/A, Storage: 477GB, OS: WINDOWS 11, Use: SERVER")
                    .installationDate(LocalDate.of(2025, 3, 10))
                    .runtimeHours(100.0)
                    .status(MachineStatus.RUNNING)
                    .lastMaintenanceDate(LocalDate.of(2026, 6, 1))
                    .nextMaintenanceDate(LocalDate.of(2026, 8, 1))
                    .build(),
            Machine.builder()
                    .machineCode("LAB205-PC10")
                    .machineName("ES0S1")
                    .department("205 PLC Lab")
                    .location("Computer No. 10")
                    .manufacturer("RAM: 16GB, Processor: N/A, Storage: 477GB, OS: WINDOWS 11, Use: OPERATOR")
                    .installationDate(LocalDate.of(2025, 3, 10))
                    .runtimeHours(100.0)
                    .status(MachineStatus.RUNNING)
                    .lastMaintenanceDate(LocalDate.of(2026, 6, 1))
                    .nextMaintenanceDate(LocalDate.of(2026, 8, 1))
                    .build(),
            Machine.builder()
                    .machineCode("LAB205-PC11")
                    .machineName("ASCS2")
                    .department("205 PLC Lab")
                    .location("Computer No. 11")
                    .manufacturer("RAM: 16GB, Processor: N/A, Storage: 477GB, OS: WINDOWS 11, Use: STAND ALONE")
                    .installationDate(LocalDate.of(2025, 3, 10))
                    .runtimeHours(100.0)
                    .status(MachineStatus.RUNNING)
                    .lastMaintenanceDate(LocalDate.of(2026, 6, 1))
                    .nextMaintenanceDate(LocalDate.of(2026, 8, 1))
                    .build(),
            Machine.builder()
                    .machineCode("LAB205-PC12")
                    .machineName("TSL")
                    .department("205 PLC Lab")
                    .location("Computer No. 12")
                    .manufacturer("RAM: 8GB, Processor: N/A, Storage: 231GB, OS: WINDOWS 10 , Use: CONTROL BUILDER")
                    .installationDate(LocalDate.of(2025, 3, 10))
                    .runtimeHours(100.0)
                    .status(MachineStatus.RUNNING)
                    .lastMaintenanceDate(LocalDate.of(2026, 6, 1))
                    .nextMaintenanceDate(LocalDate.of(2026, 8, 1))
                    .build(),
            Machine.builder()
                    .machineCode("LAB205-PC13")
                    .machineName("TSPCA12117")
                    .department("205 PLC Lab")
                    .location("Computer No. 13")
                    .manufacturer("RAM: 16 GB, Processor: N/A, Storage: 194 GB, OS: WINDOWS 10 PRO, Use: CONTROL BUILDER")
                    .installationDate(LocalDate.of(2025, 3, 10))
                    .runtimeHours(100.0)
                    .status(MachineStatus.RUNNING)
                    .lastMaintenanceDate(LocalDate.of(2026, 6, 1))
                    .nextMaintenanceDate(LocalDate.of(2026, 8, 1))
                    .build(),
            Machine.builder()
                    .machineCode("LAB205-PC14")
                    .machineName("TSPCA14484")
                    .department("205 PLC Lab")
                    .location("Computer No. 14")
                    .manufacturer("RAM: 8GB, Processor: N/A, Storage: 231GB, OS: WINDOWS 10 PRO, Use:  NO USE")
                    .installationDate(LocalDate.of(2025, 3, 10))
                    .runtimeHours(100.0)
                    .status(MachineStatus.RUNNING)
                    .lastMaintenanceDate(LocalDate.of(2026, 6, 1))
                    .nextMaintenanceDate(LocalDate.of(2026, 8, 1))
                    .build(),
            Machine.builder()
                    .machineCode("LAB206-PC01")
                    .machineName("TSPCA02126")
                    .department("206 PLC Lab")
                    .location("Computer No. 1")
                    .manufacturer("RAM: 8 GB, Processor: i5 PROCESSOR, Storage: 269 GB, OS: WINDOWS 10 PRO, Use: ROCKWELL AUTOMATION")
                    .installationDate(LocalDate.of(2025, 3, 10))
                    .runtimeHours(100.0)
                    .status(MachineStatus.RUNNING)
                    .lastMaintenanceDate(LocalDate.of(2026, 6, 1))
                    .nextMaintenanceDate(LocalDate.of(2026, 8, 1))
                    .build(),
            Machine.builder()
                    .machineCode("LAB206-PC02")
                    .machineName("ASCS1")
                    .department("206 PLC Lab")
                    .location("Computer No. 2")
                    .manufacturer("RAM: 16GB, Processor: i5 PROCESSOR, Storage: 269GB, OS: WINDOWS 10 IoT, Use: CONTROL BUILDER")
                    .installationDate(LocalDate.of(2025, 3, 10))
                    .runtimeHours(100.0)
                    .status(MachineStatus.RUNNING)
                    .lastMaintenanceDate(LocalDate.of(2026, 6, 1))
                    .nextMaintenanceDate(LocalDate.of(2026, 8, 1))
                    .build(),
            Machine.builder()
                    .machineCode("LAB206-PC03")
                    .machineName("TSPCA17557")
                    .department("206 PLC Lab")
                    .location("Computer No. 3")
                    .manufacturer("RAM: 8GB, Processor: i5 PROCESSOR, Storage: 231GB, OS: WINDOWS 10 PRO, Use: STUDIO 5000 ROCKWELL AUTOMATION")
                    .installationDate(LocalDate.of(2025, 3, 10))
                    .runtimeHours(100.0)
                    .status(MachineStatus.RUNNING)
                    .lastMaintenanceDate(LocalDate.of(2026, 6, 1))
                    .nextMaintenanceDate(LocalDate.of(2026, 8, 1))
                    .build(),
            Machine.builder()
                    .machineCode("LAB206-PC04")
                    .machineName("Offline Machine")
                    .department("206 PLC Lab")
                    .location("Computer No. 4")
                    .manufacturer("RAM: SYSTEM NOT WORKING, Processor: SYSTEM NOT WORKING, Storage: SYSTEM NOT WORKING, OS: SYSTEM NOT WORKING, Use: SYSTEM NOT WORKING")
                    .installationDate(LocalDate.of(2025, 3, 10))
                    .runtimeHours(100.0)
                    .status(MachineStatus.RUNNING)
                    .lastMaintenanceDate(LocalDate.of(2026, 6, 1))
                    .nextMaintenanceDate(LocalDate.of(2026, 8, 1))
                    .build(),
            Machine.builder()
                    .machineCode("LAB206-PC05")
                    .machineName("TSPCA127626")
                    .department("206 PLC Lab")
                    .location("Computer No. 5")
                    .manufacturer("RAM: 4GB, Processor: i3 PROCESSOR, Storage: 256GB, OS: WINDOWS 7 PROFESSIONAL, Use: STUDIO 5000 ROCKWELL AUTOMATION")
                    .installationDate(LocalDate.of(2025, 3, 10))
                    .runtimeHours(100.0)
                    .status(MachineStatus.RUNNING)
                    .lastMaintenanceDate(LocalDate.of(2026, 6, 1))
                    .nextMaintenanceDate(LocalDate.of(2026, 8, 1))
                    .build(),
            Machine.builder()
                    .machineCode("LAB206-PC06")
                    .machineName("JSSNP C0662")
                    .department("206 PLC Lab")
                    .location("Computer No. 6")
                    .manufacturer("RAM: 4 GB, Processor: i3 PROCESSOR, Storage: 512 GB, OS: WINDOWS 7 , Use: SIEMATIC MANAGER")
                    .installationDate(LocalDate.of(2025, 3, 10))
                    .runtimeHours(100.0)
                    .status(MachineStatus.RUNNING)
                    .lastMaintenanceDate(LocalDate.of(2026, 6, 1))
                    .nextMaintenanceDate(LocalDate.of(2026, 8, 1))
                    .build(),
            Machine.builder()
                    .machineCode("LAB206-PC07")
                    .machineName("TSPCA13971")
                    .department("206 PLC Lab")
                    .location("Computer No. 7")
                    .manufacturer("RAM: 8 GB, Processor: i5 PROCESSOR, Storage: 301 GB, OS: WINDOWS 10 PRO, Use: NO USE")
                    .installationDate(LocalDate.of(2025, 3, 10))
                    .runtimeHours(100.0)
                    .status(MachineStatus.RUNNING)
                    .lastMaintenanceDate(LocalDate.of(2026, 6, 1))
                    .nextMaintenanceDate(LocalDate.of(2026, 8, 1))
                    .build(),
            Machine.builder()
                    .machineCode("LAB206-PC08")
                    .machineName("ASCS1")
                    .department("206 PLC Lab")
                    .location("Computer No. 8")
                    .manufacturer("RAM: 8 GB, Processor: i5 PROCESSOR, Storage: 301 GB, OS: WINDOWS 10 PRO, Use: CONTROL BUILDER ABB DCS 800xA")
                    .installationDate(LocalDate.of(2025, 3, 10))
                    .runtimeHours(100.0)
                    .status(MachineStatus.RUNNING)
                    .lastMaintenanceDate(LocalDate.of(2026, 6, 1))
                    .nextMaintenanceDate(LocalDate.of(2026, 8, 1))
                    .build(),
            Machine.builder()
                    .machineCode("LAB206-PC09")
                    .machineName("ASCS1")
                    .department("206 PLC Lab")
                    .location("Computer No. 9")
                    .manufacturer("RAM: 16GB, Processor: i7 PROCESSOR, Storage: 477GB, OS: WINDOWS 11, Use: SERVER")
                    .installationDate(LocalDate.of(2025, 3, 10))
                    .runtimeHours(100.0)
                    .status(MachineStatus.RUNNING)
                    .lastMaintenanceDate(LocalDate.of(2026, 6, 1))
                    .nextMaintenanceDate(LocalDate.of(2026, 8, 1))
                    .build(),
            Machine.builder()
                    .machineCode("LAB206-PC10")
                    .machineName("ES0S1")
                    .department("206 PLC Lab")
                    .location("Computer No. 10")
                    .manufacturer("RAM: 16GB, Processor: i7 PROCESSOR, Storage: 477GB, OS: WINDOWS 11, Use: OPERATOR")
                    .installationDate(LocalDate.of(2025, 3, 10))
                    .runtimeHours(100.0)
                    .status(MachineStatus.RUNNING)
                    .lastMaintenanceDate(LocalDate.of(2026, 6, 1))
                    .nextMaintenanceDate(LocalDate.of(2026, 8, 1))
                    .build(),
            Machine.builder()
                    .machineCode("LAB206-PC11")
                    .machineName("ASCS2")
                    .department("206 PLC Lab")
                    .location("Computer No. 11")
                    .manufacturer("RAM: 16GB, Processor: i7 PROCESSOR, Storage: 477GB, OS: WINDOWS 11, Use: STAND ALONE")
                    .installationDate(LocalDate.of(2025, 3, 10))
                    .runtimeHours(100.0)
                    .status(MachineStatus.RUNNING)
                    .lastMaintenanceDate(LocalDate.of(2026, 6, 1))
                    .nextMaintenanceDate(LocalDate.of(2026, 8, 1))
                    .build(),
            Machine.builder()
                    .machineCode("LAB206-PC12")
                    .machineName("TSL")
                    .department("206 PLC Lab")
                    .location("Computer No. 12")
                    .manufacturer("RAM: 8GB, Processor: i5 PROCESSOR, Storage: 231GB, OS: WINDOWS 10 , Use: CONTROL BUILDER")
                    .installationDate(LocalDate.of(2025, 3, 10))
                    .runtimeHours(100.0)
                    .status(MachineStatus.RUNNING)
                    .lastMaintenanceDate(LocalDate.of(2026, 6, 1))
                    .nextMaintenanceDate(LocalDate.of(2026, 8, 1))
                    .build(),
            Machine.builder()
                    .machineCode("LAB206-PC13")
                    .machineName("TSPCA12117")
                    .department("206 PLC Lab")
                    .location("Computer No. 13")
                    .manufacturer("RAM: 16 GB, Processor: i5 PROCESSOR, Storage: 194 GB, OS: WINDOWS 10 PRO, Use: CONTROL BUILDER")
                    .installationDate(LocalDate.of(2025, 3, 10))
                    .runtimeHours(100.0)
                    .status(MachineStatus.RUNNING)
                    .lastMaintenanceDate(LocalDate.of(2026, 6, 1))
                    .nextMaintenanceDate(LocalDate.of(2026, 8, 1))
                    .build(),
            Machine.builder()
                    .machineCode("LAB206-PC14")
                    .machineName("TSPCA14484")
                    .department("206 PLC Lab")
                    .location("Computer No. 14")
                    .manufacturer("RAM: 8GB, Processor: i5 PROCESSOR, Storage: 231GB, OS: WINDOWS 10 PRO, Use:  NO USE")
                    .installationDate(LocalDate.of(2025, 3, 10))
                    .runtimeHours(100.0)
                    .status(MachineStatus.RUNNING)
                    .lastMaintenanceDate(LocalDate.of(2026, 6, 1))
                    .nextMaintenanceDate(LocalDate.of(2026, 8, 1))
                    .build()
            );

            List<Machine> savedMachines = machineRepository.saveAll(machinesList);

            // Fetch specific machines to attach maintenance records
            Machine pc1 = savedMachines.stream()
                    .filter(m -> m.getMachineCode().equals("LAB206-PC01"))
                    .findFirst().orElse(savedMachines.get(0));

            Machine pc4 = savedMachines.stream()
                    .filter(m -> m.getMachineCode().equals("LAB206-PC04"))
                    .findFirst().orElse(savedMachines.get(0));

            Machine pc10 = savedMachines.stream()
                    .filter(m -> m.getMachineCode().equals("LAB206-PC10"))
                    .findFirst().orElse(savedMachines.get(0));

            // 3. Seed Maintenance Records
            Maintenance maint1 = Maintenance.builder()
                    .machine(pc1)
                    .engineer(engineer1)
                    .maintenanceType("Software Update")
                    .description("Install Rockwell Studio 5000 patch v33.01 and verify license activation.")
                    .scheduledDate(LocalDate.of(2026, 6, 15))
                    .completedDate(LocalDate.of(2026, 6, 15))
                    .status(MaintenanceStatus.COMPLETED)
                    .remarks("Studio 5000 v33.01 installed and activated successfully. Spindle jog tests verified.")
                    .build();

            Maintenance maint2 = Maintenance.builder()
                    .machine(pc4) // Down/Offline computer
                    .engineer(engineer2)
                    .maintenanceType("Hardware Diagnosis")
                    .description("System failing to boot. Diagnose motherboard or power supply issues and repair.")
                    .scheduledDate(LocalDate.of(2026, 6, 10))
                    .status(MaintenanceStatus.PENDING)
                    .build();

            Maintenance maint3 = Maintenance.builder()
                    .machine(pc10)
                    .engineer(engineer1)
                    .maintenanceType("OS Flashing & Clean Up")
                    .description("Clean up storage directory, scan for registry anomalies, and update OS security policies.")
                    .scheduledDate(LocalDate.of(2026, 7, 20))
                    .status(MaintenanceStatus.IN_PROGRESS)
                    .remarks("Backup completed. OS updates downloading...")
                    .build();

            maintenanceRepository.saveAll(List.of(maint1, maint2, maint3));

            // 4. Seed Notifications
            Notification notif1 = Notification.builder()
                    .message("Assigned maintenance task for machine '" + pc4.getMachineName() + "' (" + pc4.getMachineCode() + ") scheduled on 2026-06-10 is OVERDUE.")
                    .isRead(false)
                    .createdAt(LocalDateTime.now().minusHours(2))
                    .build();

            Notification notif2 = Notification.builder()
                    .message("Machine '" + pc4.getMachineName() + "' (" + pc4.getMachineCode() + ") is overdue for preventive maintenance since 2026-06-10.")
                    .isRead(false)
                    .createdAt(LocalDateTime.now().minusHours(1))
                    .build();

            notificationRepository.saveAll(List.of(notif1, notif2));

            System.out.println("Seeding loaded with " + savedMachines.size() + " Excel-derived Machines, 4 Users, 3 Tasks, and 2 Alerts.");
        }
    }
}
