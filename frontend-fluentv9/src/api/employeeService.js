import axios from './axiosConfig.js';

export const getEmployeeInfo = async (staffId) => {
    const response = await axios.get(`/employee/${staffId}`);
    return response.data;
};

export const updatePhoneNumber = async (staffId, phoneNumber) => {
    const response = await axios.put(`/employee/${staffId}/phone`, { phoneNumber });
    return response.data;
};