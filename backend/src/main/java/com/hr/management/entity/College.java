package com.hr.management.entity;

import lombok.Data;

import jakarta.persistence.*;

@Entity
@Table(name = "college")
@Data
public class College {
    @Id
    @Column(name = "college_id")
    private Long collegeId;

    @Column(name = "college_name")
    private String collegeName;
}