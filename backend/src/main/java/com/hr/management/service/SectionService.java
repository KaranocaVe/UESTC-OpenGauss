package com.hr.management.service;

import com.hr.management.dto.SectionDTO;

import java.util.List;

public interface SectionService {
    List<SectionDTO> getAllSections();

    SectionDTO getSectionById(Long sectionId);

    boolean updateSectionName(Long sectionId, String newName);
}