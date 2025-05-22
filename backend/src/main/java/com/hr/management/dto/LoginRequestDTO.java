package com.hr.management.dto;

import lombok.Data;

@Data
public class LoginRequestDTO {
    private String staffId;
    private String password;
}