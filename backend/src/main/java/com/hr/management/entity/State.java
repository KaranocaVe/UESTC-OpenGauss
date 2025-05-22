package com.hr.management.entity;

import lombok.Data;

import jakarta.persistence.*;

@Entity
@Table(name = "states")
@Data
public class State {
    @Id
    @Column(name = "state_id")
    private String stateId;

    @Column(name = "state_name")
    private String stateName;

    @Column(name = "area_id")
    private Long areaId;
}