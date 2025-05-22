package com.hr.management.dto;

import lombok.Data;

@Data
public class PlaceDTO {
    private Long placeId;
    private String streetAddress;
    private String postalCode;
    private String city;
    private String stateProvince;
    private String stateId;

    // 额外字段
    private String stateName;
}