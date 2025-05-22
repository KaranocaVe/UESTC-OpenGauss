import axios from './axiosConfig.js';

export const getSectionEmployees = async (sectionId, orderBySalary = false) => {
    const response = await axios.get(`/manager/section/${sectionId}/employees?orderBySalary=${orderBySalary}`);
    return response.data;
};

export const getEmployeeById = async (sectionId, staffId) => {
    const response = await axios.get(`/manager/section/${sectionId}/employee/${staffId}`);
    return response.data;
};

export const searchEmployeesByName = async (sectionId, name) => {
    const response = await axios.get(`/manager/section/${sectionId}/search?name=${name}`);
    return response.data;
};

export const getSectionSalaryStats = async (sectionId) => {
    const response = await axios.get(`/manager/section/${sectionId}/salary-stats`);
    return response.data;
};