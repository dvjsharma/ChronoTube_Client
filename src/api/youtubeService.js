import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/fetch/videos';

export const fetchVideosService = (page = 1, limit = 10, order = 'desc', query = '') => {
    return axios.get(`${API_URL}?page=${page}&limit=${limit}&sortOrder=${order}&query=${query}`);
};
