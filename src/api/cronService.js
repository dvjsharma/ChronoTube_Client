import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/cron/';

export const cronServiceButton = (query = '', dowhat) => {
    if (dowhat === 'start') {
        return axios.post(`${API_URL}start/?${query}`);
    }
    if (dowhat === 'stop') {
        return axios.post(`${API_URL}stop/`);
    }
};
