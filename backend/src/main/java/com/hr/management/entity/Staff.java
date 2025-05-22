package com.hr.management.entity;

import lombok.Data;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "staffs")
@Data
public class Staff {
    @Id
    @Column(name = "staff_id")
    private Long staffId;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email")
    private String email;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "hire_date")
    private LocalDateTime hireDate;

    @Column(name = "employment_id")
    private String employmentId;

    @Column(name = "salary")
    private BigDecimal salary;

    @Column(name = "commission_pct")
    private BigDecimal commissionPct;

    @Column(name = "manager_id")
    private Long managerId;

    @Column(name = "section_id")
    private Long sectionId;

    @Column(name = "password")
    private String password;
}