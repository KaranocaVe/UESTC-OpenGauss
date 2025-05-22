import axios from './axiosConfig.js';

export const getAllEmployees = async (orderBySalary = false) => {
    const response = await axios.get(`/hr/employees`, {
        params: {orderBySalary: orderBySalary ? 'true' : 'false'}
    });
    return response.data;
};

export const getEmployeeById = async (staffId) => {
    const response = await axios.get(`/hr/employee/${staffId}`);
    return response.data;
};

export const searchEmployeesByName = async (name) => {
    const response = await axios.get(`/hr/search?name=${name}`);
    return response.data;
};

export const getAllSalaryStats = async () => {
    const response = await axios.get('/hr/salary-stats');
    return response.data;
};

export const getAllSections = async () => {
    const response = await axios.get('/hr/sections');
    return response.data;
};

export const getSectionById = async (sectionId) => {
    const response = await axios.get(`/hr/section/${sectionId}`);
    return response.data;
};

export const updateSectionName = async (sectionId, sectionName) => {
    const response = await axios.put(`/hr/section/${sectionId}`, { sectionName });
    return response.data;
};

export const getAllPlaces = async () => {
    const response = await axios.get('/hr/places');
    return response.data;
};

export const addPlace = async (placeData) => {
    const response = await axios.post('/hr/places', placeData);
    return response.data;
};

export const getEmployeeWorkHistory = async (staffId) => {
    const response = await axios.get(`/hr/employee/${staffId}/history`);
    return response.data;
};