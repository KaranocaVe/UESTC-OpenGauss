package com.hr.management.controller;

import com.hr.management.dto.*;
import com.hr.management.service.EmploymentHistoryService;
import com.hr.management.service.PlaceService;
import com.hr.management.service.SectionService;
import com.hr.management.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hr")
public class HRManagerController {

    private final StaffService staffService;
    private final SectionService sectionService;
    private final PlaceService placeService;
    private final EmploymentHistoryService employmentHistoryService;

    @Autowired
    public HRManagerController(StaffService staffService,
                               SectionService sectionService,
                               PlaceService placeService,
                               EmploymentHistoryService employmentHistoryService) {
        this.staffService = staffService;
        this.sectionService = sectionService;
        this.placeService = placeService;
        this.employmentHistoryService = employmentHistoryService;
    }

    @GetMapping("/employees")
    public ResponseEntity<List<StaffDTO>> getAllEmployees(
            @RequestParam(defaultValue = "false") boolean orderBySalary) {

        List<StaffDTO> employees = staffService.getAllStaff(orderBySalary);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/employee/{staffId}")
    public ResponseEntity<StaffDTO> getEmployeeById(@PathVariable Long staffId) {
        StaffDTO employee = staffService.getStaffById(staffId);
        if (employee != null) {
            return ResponseEntity.ok(employee);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<StaffDTO>> searchEmployeesByName(@RequestParam String name) {
        List<StaffDTO> employees = staffService.searchStaffByName(name);
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/salary-stats")
    public ResponseEntity<List<SalaryStatsDTO>> getAllSectionsSalaryStats() {
        List<SalaryStatsDTO> stats = staffService.getSalaryStatsByAllSections();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/sections")
    public ResponseEntity<List<SectionDTO>> getAllSections() {
        List<SectionDTO> sections = sectionService.getAllSections();
        return ResponseEntity.ok(sections);
    }

    @GetMapping("/section/{sectionId}")
    public ResponseEntity<SectionDTO> getSectionById(@PathVariable Long sectionId) {
        SectionDTO section = sectionService.getSectionById(sectionId);
        if (section != null) {
            return ResponseEntity.ok(section);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/section/{sectionId}")
    public ResponseEntity<Void> updateSectionName(
            @PathVariable Long sectionId,
            @RequestBody SectionUpdateRequestDTO request) {

        boolean updated = sectionService.updateSectionName(sectionId, request.getSectionName());
        if (updated) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/places")
    public ResponseEntity<List<PlaceDTO>> getAllPlaces() {
        List<PlaceDTO> places = placeService.getAllPlaces();
        return ResponseEntity.ok(places);
    }

    @PostMapping("/places")
    public ResponseEntity<PlaceDTO> addPlace(@RequestBody PlaceDTO placeDTO) {
        PlaceDTO savedPlace = placeService.addPlace(placeDTO);
        return ResponseEntity.ok(savedPlace);
    }

    @GetMapping("/employee/{staffId}/history")
    public ResponseEntity<List<EmploymentHistoryDTO>> getEmployeeWorkHistory(@PathVariable Long staffId) {
        List<EmploymentHistoryDTO> history = employmentHistoryService.getEmploymentHistoryByStaffId(staffId);
        return ResponseEntity.ok(history);
    }
}