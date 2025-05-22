package com.hr.management.service.impl;

import com.hr.management.dto.PlaceDTO;
import com.hr.management.entity.Place;
import com.hr.management.repository.PlaceRepository;
import com.hr.management.repository.StateRepository;
import com.hr.management.service.PlaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PlaceServiceImpl implements PlaceService {

    private final PlaceRepository placeRepository;
    private final StateRepository stateRepository;

    @Autowired
    public PlaceServiceImpl(PlaceRepository placeRepository, StateRepository stateRepository) {
        this.placeRepository = placeRepository;
        this.stateRepository = stateRepository;
    }

    @Override
    public List<PlaceDTO> getAllPlaces() {
        List<Place> places = placeRepository.findAll();
        return places.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public PlaceDTO getPlaceById(Long placeId) {
        Optional<Place> placeOpt = placeRepository.findById(placeId);
        return placeOpt.map(this::convertToDTO).orElse(null);
    }

    @Override
    public PlaceDTO addPlace(PlaceDTO placeDTO) {
        Place place = new Place();
        place.setStreetAddress(placeDTO.getStreetAddress());
        place.setPostalCode(placeDTO.getPostalCode());
        place.setCity(placeDTO.getCity());
        place.setStateProvince(placeDTO.getStateProvince());
        place.setStateId(placeDTO.getStateId());

        Place savedPlace = placeRepository.save(place);
        return convertToDTO(savedPlace);
    }

    private PlaceDTO convertToDTO(Place place) {
        PlaceDTO dto = new PlaceDTO();
        dto.setPlaceId(place.getPlaceId());
        dto.setStreetAddress(place.getStreetAddress());
        dto.setPostalCode(place.getPostalCode());
        dto.setCity(place.getCity());
        dto.setStateProvince(place.getStateProvince());
        dto.setStateId(place.getStateId());

        // 获取国家/省份名称
        stateRepository.findById(place.getStateId())
                .ifPresent(state -> dto.setStateName(state.getStateName()));

        return dto;
    }
}