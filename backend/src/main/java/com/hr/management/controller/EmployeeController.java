package com.hr.management.controller;

import com.hr.management.dto.PhoneUpdateRequestDTO;
import com.hr.management.dto.StaffDTO;
import com.hr.management.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {

    private final StaffService staffService;

    @Autowired
    public EmployeeController(StaffService staffService) {
        this.staffService = staffService;
    }

    @GetMapping("/{staffId}")
    public ResponseEntity<StaffDTO> getEmployeeInfo(@PathVariable Long staffId) {
        StaffDTO staffDTO = staffService.getStaffInfo(staffId);
        if (staffDTO != null) {
            return ResponseEntity.ok(staffDTO);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{staffId}/phone")
    public ResponseEntity<Void> updatePhoneNumber(
            @PathVariable Long staffId,
            @RequestBody PhoneUpdateRequestDTO request) {

        boolean updated = staffService.updatePhoneNumber(staffId, request.getPhoneNumber());
        if (updated) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}