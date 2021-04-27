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

    getProjects(pageNr,sizeNr) {
        return axios.get(API_BASE_URL + '/v1/projects/page',{params: {page:pageNr, size:sizeNr}}, { headers: authHeader() });
    }

    deleteProject(projectId){
        return axios.delete(API_BASE_URL + '/v1/projects/' + projectId, { headers: authHeader() });
    }

    getProjectById(projectId){
        return axios.get(API_BASE_URL + '/v1/projects/' + projectId, { headers: authHeader() });
    }

    createProject(project) {
        return axios.post(API_BASE_URL+ '/v1/projects/createProject', project, { headers: authHeader() });
    }
    
    updateProject(project, projectId){
        return axios.put(API_BASE_URL+ '/v1/projects/'+projectId,project, { headers: authHeader() });
    }
}

export default new UserService();
