package com.hr.management.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "sections")
@Data
public class Section {
    @Id
    @Column(name = "section_id")
    private Long sectionId;

    @Column(name = "section_name")
    private String sectionName;

    @Column(name = "manager_id")
    private Long managerId;

    @Column(name = "place_id")
    private Long placeId;
}