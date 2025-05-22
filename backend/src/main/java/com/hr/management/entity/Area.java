package com.hr.management.entity;

import lombok.Data;

import jakarta.persistence.*;

@Entity
@Table(name = "areas")
@Data
public class Area {
    @Id
    @Column(name = "area_id")
    private Long areaId;

    @Column(name = "area_name")
    private String areaName;
}