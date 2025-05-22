package com.hr.management.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SalaryStatsDTO {
    private Long sectionId;
    private String sectionName;
    private BigDecimal maxSalary;
    private BigDecimal minSalary;
    private Double avgSalary;
}