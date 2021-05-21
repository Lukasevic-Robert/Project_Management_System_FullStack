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

    createUpdateUser(user, id) {
        return axios.put(API_BASE_URL + '/v1/users/' + id, user, { headers: authHeader() });
    }

    deleteUser(id) {
        return axios.delete(API_BASE_URL + '/v1/users/' + id, { headers: authHeader() });
    }

    getUserPage(pageNr, sizeNr) {
        let config = {
            headers: authHeader(),
            params: {
                page: pageNr, size: sizeNr, sort: `status,id,desc`
            },
        }
        return axios.get(API_BASE_URL + '/v1/users/page', config);
    }

    getUserByKeyword(keyword, pageNr, sizeNr) {
        let config = {
            headers: authHeader(),
            params: {
                keyword: keyword, page: pageNr, size: sizeNr, sort: `first_name,desc`
            },
        }
        return axios.get(API_BASE_URL + '/v1/users/pageFilter', config);
    }

    requestUserCSV() {
        return axios({
            url: API_BASE_URL + '/v1/users/export',
            headers: authHeader(),
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            console.log(response);
            link.href = url;
            link.setAttribute('download', `users_${Date.now()}.csv`); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    }

}

export default new UserService();
