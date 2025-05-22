package com.hr.management.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class StaffDTO {
    private Long staffId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private LocalDateTime hireDate;
    private String employmentId;
    private BigDecimal salary;
    private BigDecimal commissionPct;
    private Long managerId;
    private Long sectionId;

    // 额外字段，提供更多上下文信息
    private String sectionName;
    private String managerName;
    private String employmentTitle;

    @JsonIgnore
    private String password;
}