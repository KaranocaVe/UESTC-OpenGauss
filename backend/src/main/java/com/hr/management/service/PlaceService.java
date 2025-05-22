package com.hr.management.service;

import com.hr.management.dto.PlaceDTO;

import java.util.List;

public interface PlaceService {
    List<PlaceDTO> getAllPlaces();

    PlaceDTO getPlaceById(Long placeId);

    PlaceDTO addPlace(PlaceDTO placeDTO);
}