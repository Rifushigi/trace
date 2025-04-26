import axios from 'axios';
import { mlServiceUrl } from './constants_config.js';

export const axiosConfig = {
    mlService: axios.create({
        baseURL: mlServiceUrl,
        timeout: 5000,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}; 