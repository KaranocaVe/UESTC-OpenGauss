import axios from './axiosConfig.js';

export const login = async (staffId, password) => {
    const response = await axios.post('/auth/login', { staffId, password });
    return response.data;
};