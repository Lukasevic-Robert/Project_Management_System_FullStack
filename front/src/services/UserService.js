import axios from 'axios';
import authHeader from './authHeader';

const API_BASE_URL = `http://localhost:8080/api`;

class UserService {

    getPublicContent() {
        return axios.get(API_BASE_URL);
    }

    getUserBoard() {
        return axios.get(API_BASE_URL + 'user', { headers: authHeader() });
    }

    getModeratorBoard() {
        return axios.get(API_BASE_URL + 'mod', { headers: authHeader() });
    }

    getAdminBoard() {
        return axios.get(API_BASE_URL + 'admin', { headers: authHeader() });
    }
}

export default new UserService();
