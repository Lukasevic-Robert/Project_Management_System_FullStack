import axios from 'axios';
import authHeader from './authHeader';


const API_BASE_URL = `http://localhost:8080/api`;


    const getProjects = (pageNr, sizeNr) => {
        let config = {
            headers: authHeader(),
            params: {
                page:pageNr, size:sizeNr, sort:`id,desc`
            },
          }
          console.log(config)
        return axios.get(API_BASE_URL + '/v1/projects/page', config);
    }

    const deleteProject = (projectId) => {
        return axios.delete(API_BASE_URL + '/v1/projects/' + projectId, { headers: authHeader() });
    }


    const getProjectById = (projectId) => {
        return axios.get(API_BASE_URL + '/v1/projects/' + projectId, { headers: authHeader() });
    }

    const createProject = (project) => {
        return axios.post(API_BASE_URL+ '/v1/projects', project, { headers: authHeader() });
    }
    
    const updateProject = (project, projectId) => {
        return axios.put(API_BASE_URL+ '/v1/projects/'+projectId,project, { headers: authHeader() });
    }
export default{
    getProjects,
    deleteProject,
    getProjectById,
    createProject,
    updateProject
};
