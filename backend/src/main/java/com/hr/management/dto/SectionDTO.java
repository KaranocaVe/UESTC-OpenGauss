package com.hr.management.dto;

import lombok.Data;

@Data
public class SectionDTO {
    private Long sectionId;
    private String sectionName;
    private Long managerId;
    private Long placeId;

    // 额外字段
    private String managerName;
    private String placeAddress;
    private String placeCity;
}