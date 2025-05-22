package com.hr.management.service.impl;

import com.hr.management.dto.SectionDTO;
import com.hr.management.entity.Section;
import com.hr.management.repository.PlaceRepository;
import com.hr.management.repository.SectionRepository;
import com.hr.management.repository.StaffRepository;
import com.hr.management.service.SectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SectionServiceImpl implements SectionService {

    private final SectionRepository sectionRepository;
    private final StaffRepository staffRepository;
    private final PlaceRepository placeRepository;

    @Autowired
    public SectionServiceImpl(SectionRepository sectionRepository,
                              StaffRepository staffRepository,
                              PlaceRepository placeRepository) {
        this.sectionRepository = sectionRepository;
        this.staffRepository = staffRepository;
        this.placeRepository = placeRepository;
    }

    @Override
    public List<SectionDTO> getAllSections() {
        List<Section> sections = sectionRepository.findAll();
        return sections.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public SectionDTO getSectionById(Long sectionId) {
        Optional<Section> sectionOpt = sectionRepository.findById(sectionId);
        return sectionOpt.map(this::convertToDTO).orElse(null);
    }

    @Override
    public boolean updateSectionName(Long sectionId, String newName) {
        Optional<Section> sectionOpt = sectionRepository.findById(sectionId);
        if (sectionOpt.isPresent()) {
            Section section = sectionOpt.get();
            section.setSectionName(newName);
            sectionRepository.save(section);
            return true;
        }
        return false;
    }

    private SectionDTO convertToDTO(Section section) {
        SectionDTO dto = new SectionDTO();
        dto.setSectionId(section.getSectionId());
        dto.setSectionName(section.getSectionName());
        dto.setManagerId(section.getManagerId());
        dto.setPlaceId(section.getPlaceId());

        // 获取经理姓名
        try {
            staffRepository.findById(section.getManagerId())
                    .ifPresent(manager -> dto.setManagerName(manager.getFirstName() + " " + manager.getLastName()));
        } catch (Exception e) {
            dto.setManagerName("");
        }
        // 获取地点信息
        placeRepository.findById(section.getPlaceId())
                .ifPresent(place -> {
                    dto.setPlaceAddress(place.getStreetAddress());
                    dto.setPlaceCity(place.getCity());
                });

        return dto;
    }
}