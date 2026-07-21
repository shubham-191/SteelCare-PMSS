package com.steelcare.pmms.controller;

import com.steelcare.pmms.dto.DashboardDto;
import com.steelcare.pmms.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
@Tag(name = "Dashboard Statistics", description = "Endpoints for retrieving aggregated statistics and charts data")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    @Operation(summary = "Get aggregated metrics, status charts, monthly trends, and recent activities")
    public ResponseEntity<DashboardDto> getDashboardData() {
        return ResponseEntity.ok(dashboardService.getDashboardData());
    }
}
