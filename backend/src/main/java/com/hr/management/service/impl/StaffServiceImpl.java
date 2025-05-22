package com.hr.management.service.impl;

import com.hr.management.dto.SalaryStatsDTO;
import com.hr.management.dto.StaffDTO;
import com.hr.management.entity.Employment;
import com.hr.management.entity.Section;
import com.hr.management.entity.Staff;
import com.hr.management.repository.EmploymentRepository;
import com.hr.management.repository.SectionRepository;
import com.hr.management.repository.StaffRepository;
import com.hr.management.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StaffServiceImpl implements StaffService {

    private final StaffRepository staffRepository;
    private final SectionRepository sectionRepository;
    private final EmploymentRepository employmentRepository;

    @Autowired
    public StaffServiceImpl(StaffRepository staffRepository, SectionRepository sectionRepository,EmploymentRepository employmentRepository) {
        this.staffRepository = staffRepository;
        this.sectionRepository = sectionRepository;
        this.employmentRepository = employmentRepository;
    }

    @Override
    public Optional<Staff> login(Long staffId, String password) {
        return staffRepository.findByStaffIdAndPassword(staffId, password);
    }

    @Override
    public StaffDTO getStaffInfo(Long staffId) {
        Optional<Staff> staffOpt = staffRepository.findById(staffId);
        return staffOpt.map(this::convertToDTO).orElse(null);
    }

    @Override
    public boolean updatePhoneNumber(Long staffId, String phoneNumber) {
        Optional<Staff> staffOpt = staffRepository.findById(staffId);
        if (staffOpt.isPresent()) {
            Staff staff = staffOpt.get();
            staff.setPhoneNumber(phoneNumber);
            staffRepository.save(staff);
            return true;
        }
        return false;
    }

    @Override
    public List<StaffDTO> getAllStaffBySection(Long sectionId, boolean orderBySalary) {
        List<Staff> staffList;
        if (orderBySalary) {
            staffList = staffRepository.findBySectionIdOrderBySalaryDesc(sectionId);
        } else {
            staffList = staffRepository.findBySectionIdOrderByStaffIdAsc(sectionId);
        }
        return staffList.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public List<StaffDTO> getAllStaff(boolean orderBySalary) {
        List<Staff> staffList;
        if (orderBySalary) {
            staffList = staffRepository.findAll().stream()
                    .sorted((s1, s2) -> s2.getSalary().compareTo(s1.getSalary()))
                    .collect(Collectors.toList());
        } else {
            staffList = staffRepository.findAll().stream()
                    .sorted(Comparator.comparing(Staff::getStaffId))
                    .collect(Collectors.toList());
        }
        return staffList.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public StaffDTO getStaffById(Long staffId) {
        Optional<Staff> staffOpt = staffRepository.findById(staffId);
        return staffOpt.map(this::convertToDTO).orElse(null);
    }

    @Override
    public List<StaffDTO> searchStaffByName(String name, Long sectionId) {
        List<Staff> staffList = staffRepository.findBySectionIdAndFirstNameContainingOrSectionIdAndLastNameContaining(
                sectionId, name, sectionId, name);
        return staffList.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public List<StaffDTO> searchStaffByName(String name) {
        List<Staff> staffList = staffRepository.findByFirstNameContainingOrLastNameContaining(name, name);
        return staffList.stream().map(this::convertToDTO).collect(Collectors.toList());
    }


    @Override
    public SalaryStatsDTO getSalaryStatsBySection(Long sectionId) {
        Object[][] stats = staffRepository.getSalaryStatsBySection(sectionId);
        if (stats != null) {
            SalaryStatsDTO dto = new SalaryStatsDTO();
            dto.setSectionId(sectionId);
            dto.setMaxSalary((BigDecimal) stats[0][0]);
            dto.setMinSalary((BigDecimal) stats[0][1]);
            dto.setAvgSalary((Double) stats[0][2]);

            Optional<Section> sectionOpt = sectionRepository.findById(sectionId);
            sectionOpt.ifPresent(section -> dto.setSectionName(section.getSectionName()));

            return dto;
        }
        return null;
    }

    @Override
    public List<SalaryStatsDTO> getSalaryStatsByAllSections() {
        List<Object[]> statsList = staffRepository.getSalaryStatsByAllSections();
        List<SalaryStatsDTO> result = new ArrayList<>();

        for (Object[] stats : statsList) {
            SalaryStatsDTO dto = new SalaryStatsDTO();
            Long sectionId = (Long) stats[0];
            dto.setSectionId(sectionId);
            dto.setMaxSalary((BigDecimal) stats[1]);
            dto.setMinSalary((BigDecimal) stats[2]);
            dto.setAvgSalary((Double) stats[3]);

            Optional<Section> sectionOpt = sectionRepository.findById(sectionId);
            sectionOpt.ifPresent(section -> dto.setSectionName(section.getSectionName()));

            result.add(dto);
        }

        return result;
    }

    @Override
    public boolean isManager(Long staffId) {
        return sectionRepository.findAll().stream()
                .anyMatch(section -> staffId.equals(section.getManagerId()));
    }

    private StaffDTO convertToDTO(Staff staff) {
        StaffDTO dto = new StaffDTO();
        dto.setStaffId(staff.getStaffId());
        dto.setFirstName(staff.getFirstName());
        dto.setLastName(staff.getLastName());
        dto.setEmail(staff.getEmail());
        dto.setPhoneNumber(staff.getPhoneNumber());
        dto.setHireDate(staff.getHireDate());
        dto.setEmploymentId(staff.getEmploymentId());
        dto.setSalary(staff.getSalary());
        dto.setCommissionPct(staff.getCommissionPct());
        dto.setManagerId(staff.getManagerId());
        dto.setSectionId(staff.getSectionId());

        // 获取部门名称
        Optional<Section> sectionOpt = sectionRepository.findById(staff.getSectionId());
        sectionOpt.ifPresent(section -> dto.setSectionName(section.getSectionName()));

        // 获取职位名称
        Optional<Employment> employmentOpt = employmentRepository.findById(staff.getEmploymentId());
        employmentOpt.ifPresent(employment -> dto.setEmploymentTitle(employment.getEmploymentTitle()));

        return dto;
    }
}