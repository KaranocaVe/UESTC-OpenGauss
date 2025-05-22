package com.hr.management.entity;

import lombok.Data;

import jakarta.persistence.*;

@Entity
@Table(name = "places")
@Data
public class Place {
    @Id
    @Column(name = "place_id")
    private Long placeId;

    @Column(name = "street_address")
    private String streetAddress;

    @Column(name = "postal_code")
    private String postalCode;

    @Column(name = "city")
    private String city;

    @Column(name = "state_province")
    private String stateProvince;

    @Column(name = "state_id")
    private String stateId;
}