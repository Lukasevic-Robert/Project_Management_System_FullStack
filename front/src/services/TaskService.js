import axios from 'axios';
import authHeader from './authHeader';


const API_BASE_URL = `http://localhost:8080/api/v1/projects/`;


class TaskService{

    // getProjects(pageNr, sizeNr) {
    //     let config = {
    //         headers: authHeader(),
    //         params: {
    //             page:pageNr, size:sizeNr, sort:`id,desc`
    //         },
    //       }
    //       console.log(config)
    //     return axios.get(API_BASE_URL + '/v1/projects/page', config);
    // }

    deleteTask(taskId){
        return axios.delete(API_BASE_URL + 'tasks/' + taskId, { headers: authHeader() });
    }


    getActiveTasks(projectId){
        return axios.get(API_BASE_URL + projectId + '/tasks/active', { headers: authHeader() });
    }

    getBacklogTasks(projectId){
        return axios.get(API_BASE_URL + projectId + '/tasks/backlog', { headers: authHeader() });
    }

    getAllTasks(){
        return axios.get(API_BASE_URL + 'tasks', { headers: authHeader() });
    }

    createTask(task) {
        return axios.post(API_BASE_URL+ 'tasks', task, { headers: authHeader() });
    }
    
    updateTask(task, taskId){
        return axios.put(API_BASE_URL+ 'tasks/'+taskId,task, { headers: authHeader() });
    }

    getTaskById(taskId){
        return axios.get(API_BASE_URL+ 'tasks/'+taskId, { headers: authHeader() });
    }

    requestTasksCSV = (projectId) => {
        return axios({
            url: API_BASE_URL+ projectId + '/tasks/export',
            headers: authHeader(),
            method: 'GET',
            responseType: 'blob', // important
          }).then((response) => {
             const url = window.URL.createObjectURL(new Blob([response.data]));
             const link = document.createElement('a');
             link.href = url;
             link.setAttribute('download', `tasks_${Date.now()}.csv`); //or any other extension
             document.body.appendChild(link);
             link.click();
          });
    }
}
export default new TaskService()