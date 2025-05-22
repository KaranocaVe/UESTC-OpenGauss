package com.hr.management.service;

import com.hr.management.dto.EmploymentHistoryDTO;

import java.util.List;

public interface EmploymentHistoryService {
    List<EmploymentHistoryDTO> getEmploymentHistoryByStaffId(Long staffId);
}