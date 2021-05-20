import axios from 'axios';
import authHeader from './authHeader';

const API_BASE_URL = `http://localhost:8080/api`;
const TEST_URL = `http://localhost:8080/api/v1/test/`;

class UserService {

    getPublicContent() {
        return axios.get(API_BASE_URL);
    }

    getUserBoard() {
        return axios.get(TEST_URL + 'user', { headers: authHeader() });
    }

    getModeratorBoard() {
        return axios.get(TEST_URL + 'mod', { headers: authHeader() });
    }

    getAdminBoard() {
        return axios.get(TEST_URL + 'admin', { headers: authHeader() });
    }

    getUsers() {
        return axios.get(API_BASE_URL + '/v1/users', { headers: authHeader() });
    }

    getUserById(id) {
        return axios.get(API_BASE_URL + '/v1/users/' + id, { headers: authHeader() });
    }

    createUpdateUser(id){
        return axios.put(API_BASE_URL + '/v1/users/' + id, { headers: authHeader() });
    }

    deleteUser(id) {
        return axios.delete(API_BASE_URL + '/v1/users/' + id, { headers: authHeader() });
    }
    
    getUserPage(pageNr, sizeNr) {
        let config = {
            headers: authHeader(),
            params: {
                page:pageNr, size:sizeNr, sort:`id,asc`
            },
          }
        return axios.get(API_BASE_URL + '/v1/users/page', config);
    }
    
}

export default new UserService();
