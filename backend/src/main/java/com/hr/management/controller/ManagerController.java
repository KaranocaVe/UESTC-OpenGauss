package com.hr.management.controller;

import com.hr.management.dto.SalaryStatsDTO;
import com.hr.management.dto.StaffDTO;
import com.hr.management.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/manager")
public class ManagerController {

    private final StaffService staffService;

    @Autowired
    public ManagerController(StaffService staffService) {
        this.staffService = staffService;
    }

    @GetMapping("/section/{sectionId}/employees")
    public ResponseEntity<List<StaffDTO>> getSectionEmployees(
            @PathVariable Long sectionId,
            @RequestParam(defaultValue = "false") boolean orderBySalary) {

        List<StaffDTO> employees = staffService.getAllStaffBySection(sectionId, orderBySalary);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/section/{sectionId}/employee/{staffId}")
    public ResponseEntity<StaffDTO> getEmployeeById(
            @PathVariable Long sectionId,
            @PathVariable Long staffId) {

        StaffDTO employee = staffService.getStaffById(staffId);
        if (employee != null && employee.getSectionId().equals(sectionId)) {
            return ResponseEntity.ok(employee);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/section/{sectionId}/search")
    public ResponseEntity<List<StaffDTO>> searchEmployeesByName(
            @PathVariable Long sectionId,
            @RequestParam String name) {

        List<StaffDTO> employees = staffService.searchStaffByName(name, sectionId);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/section/{sectionId}/salary-stats")
    public ResponseEntity<SalaryStatsDTO> getSectionSalaryStats(@PathVariable Long sectionId) {
        SalaryStatsDTO stats = staffService.getSalaryStatsBySection(sectionId);
        if (stats != null) {
            return ResponseEntity.ok(stats);
        }
        return ResponseEntity.notFound().build();
    }
}