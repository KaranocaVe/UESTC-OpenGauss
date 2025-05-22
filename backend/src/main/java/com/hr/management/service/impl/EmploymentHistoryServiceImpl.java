package com.hr.management.service.impl;

import com.hr.management.dto.EmploymentHistoryDTO;
import com.hr.management.entity.EmploymentHistory;
import com.hr.management.repository.EmploymentHistoryRepository;
import com.hr.management.repository.EmploymentRepository;
import com.hr.management.repository.SectionRepository;
import com.hr.management.service.EmploymentHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmploymentHistoryServiceImpl implements EmploymentHistoryService {

    private final EmploymentHistoryRepository employmentHistoryRepository;
    private final EmploymentRepository employmentRepository;
    private final SectionRepository sectionRepository;

    @Autowired
    public EmploymentHistoryServiceImpl(EmploymentHistoryRepository employmentHistoryRepository,
                                        EmploymentRepository employmentRepository,
                                        SectionRepository sectionRepository) {
        this.employmentHistoryRepository = employmentHistoryRepository;
        this.employmentRepository = employmentRepository;
        this.sectionRepository = sectionRepository;
    }

    @Override
    public List<EmploymentHistoryDTO> getEmploymentHistoryByStaffId(Long staffId) {
        List<EmploymentHistory> historyList = employmentHistoryRepository.findByStaffId(staffId);
        return historyList.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private EmploymentHistoryDTO convertToDTO(EmploymentHistory history) {
        EmploymentHistoryDTO dto = new EmploymentHistoryDTO();
        dto.setStaffId(history.getStaffId());
        dto.setStartDate(history.getStartDate());
        dto.setEndDate(history.getEndDate());
        dto.setEmploymentId(history.getEmploymentId());
        dto.setSectionId(history.getSectionId());

        // 获取职位名称
        employmentRepository.findById(history.getEmploymentId())
                .ifPresent(employment -> dto.setEmploymentTitle(employment.getEmploymentTitle()));

        // 获取部门名称
        sectionRepository.findById(history.getSectionId())
                .ifPresent(section -> dto.setSectionName(section.getSectionName()));


        return dto;
    }
}