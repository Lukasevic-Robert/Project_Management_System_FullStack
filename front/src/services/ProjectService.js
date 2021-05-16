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
        return axios.get(API_BASE_URL + '/v1/projects/page', config);
    }

    const getProjectsByUser = (pageNr, sizeNr) => {
        let config = {
            headers: authHeader(),
            params: {
                page:pageNr, size:sizeNr, sort:`id,desc`
            },
          }
        return axios.get(API_BASE_URL + '/v1/projects/pageByUser', config);
    }

    const deleteProject = (projectId) => {
        return axios.delete(API_BASE_URL + '/v1/projects/' + projectId, { headers: authHeader() });
    }

    const getProjectById = (projectId) => {
        return axios.get(API_BASE_URL + '/v1/projects/' + projectId, { headers: authHeader() });
    }

    const getProjectByKeyword = (keyword, pageNr, sizeNr) => {
        let config = {
            headers: authHeader(),
            params: {
               keyword: keyword, page:pageNr, size:sizeNr, sort:`id,desc`
            },
          }
        return axios.get(API_BASE_URL + '/v1/projects/pageFilter', config);
    }

    const createProject = (project) => {
        return axios.post(API_BASE_URL+ '/v1/projects', project, { headers: authHeader() });
    }
    
    const updateProject = (project, projectId) => {
        return axios.put(API_BASE_URL+ '/v1/projects/'+projectId,project, { headers: authHeader() });
    }

    const requestProjectCSV = () => {
        return axios({
            url: API_BASE_URL+ '/v1/projects/export',
            headers: authHeader(),
            method: 'GET',
            responseType: 'blob', // important
          }).then((response) => {
             const url = window.URL.createObjectURL(new Blob([response.data]));
             const link = document.createElement('a');
             console.log(response);
             link.href = url;
             link.setAttribute('download', `projects_${Date.now()}.csv`); //or any other extension
             document.body.appendChild(link);
             link.click();
          });
    }

export default{
    getProjects,
    deleteProject,
    getProjectById,
    createProject,
    updateProject,
    getProjectsByUser,
    requestProjectCSV,
    getProjectByKeyword
};
