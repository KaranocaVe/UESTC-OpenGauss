package com.hr.management.dto;

import lombok.Data;

@Data
public class LoginResponseDTO {
    private String staffId;
    private String firstName;
    private String lastName;
    private String role;  // EMPLOYEE, DEPARTMENT_MANAGER, HR_MANAGER
    private String sectionId;  // 仅部门经理需要
}