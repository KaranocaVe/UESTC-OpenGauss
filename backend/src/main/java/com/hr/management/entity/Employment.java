package com.hr.management.entity;

import lombok.Data;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "employments")
@Data
public class Employment {
    @Id
    @Column(name = "employment_id")
    private String employmentId;

    @Column(name = "employment_title")
    private String employmentTitle;

    @Column(name = "min_salary")
    private BigDecimal minSalary;

    @Column(name = "max_salary")
    private BigDecimal maxSalary;
}