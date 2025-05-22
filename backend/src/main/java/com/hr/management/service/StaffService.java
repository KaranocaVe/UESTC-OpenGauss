package com.hr.management.service;

import com.hr.management.dto.SalaryStatsDTO;
import com.hr.management.dto.StaffDTO;
import com.hr.management.entity.Staff;

import java.util.List;
import java.util.Optional;

public interface StaffService {
    Optional<Staff> login(Long staffId, String password);

    StaffDTO getStaffInfo(Long staffId);

    boolean updatePhoneNumber(Long staffId, String phoneNumber);

    List<StaffDTO> getAllStaffBySection(Long sectionId, boolean orderBySalary);

    List<StaffDTO> getAllStaff(boolean orderBySalary);

    StaffDTO getStaffById(Long staffId);

    List<StaffDTO> searchStaffByName(String name, Long sectionId);

    List<StaffDTO> searchStaffByName(String name);

    SalaryStatsDTO getSalaryStatsBySection(Long sectionId);

    List<SalaryStatsDTO> getSalaryStatsByAllSections();

    boolean isManager(Long staffId);
}