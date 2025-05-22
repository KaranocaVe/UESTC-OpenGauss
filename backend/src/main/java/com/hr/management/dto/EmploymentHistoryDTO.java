package com.hr.management.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EmploymentHistoryDTO {
    private Long staffId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String employmentId;
    private Long sectionId;

    // 额外字段
    private String employmentTitle;
    private String sectionName;
}