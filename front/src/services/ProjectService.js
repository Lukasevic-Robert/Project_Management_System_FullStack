import axios from 'axios';
import authHeader from './authHeader';


const API_BASE_URL = `http://localhost:8080/api`;


class ProjectService{

    getProjects(pageNr, sizeNr) {
        let config = {
            headers: authHeader(),
            params: {
                page:pageNr, size:sizeNr, sort:`id,desc`
            },
          }
          console.log(config)
        return axios.get(API_BASE_URL + '/v1/projects/page', config);
    }

    deleteProject(projectId){
        return axios.delete(API_BASE_URL + '/v1/projects/' + projectId, { headers: authHeader() });
    }


    getProjectById(projectId){
        return axios.get(API_BASE_URL + '/v1/projects/' + projectId, { headers: authHeader() });
    }

    createProject(project) {
        return axios.post(API_BASE_URL+ '/v1/projects', project, { headers: authHeader() });
    }
    
    updateProject(project, projectId){
        return axios.put(API_BASE_URL+ '/v1/projects/'+projectId,project, { headers: authHeader() });
    }
}
export default new ProjectService()