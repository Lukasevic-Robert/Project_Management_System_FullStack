import axios from 'axios';
import authHeader from './authHeader';


const API_BASE_URL = `http://localhost:8080/`;


    const getEntries = (pageNr, sizeNr) => {
        let config = {
            headers: authHeader(),
            params: {
                page:pageNr, size:sizeNr
            },
          }
        return axios.get(API_BASE_URL + 'admin/journal/page', config);
    }

    const requestJournalCSV = () => {
        return axios({
            url: API_BASE_URL+ 'admin/journal/export',
            headers: authHeader(),
            method: 'GET',
            responseType: 'blob', // important
          }).then((response) => {
             const url = window.URL.createObjectURL(new Blob([response.data]));
             const link = document.createElement('a');
             link.href = url;
             link.setAttribute('download', `entries_${Date.now()}.csv`); //or any other extension
             document.body.appendChild(link);
             link.click();
          })
          .catch(e => {
            console.log(e)})
    }

    
export default{
    getEntries,
    requestJournalCSV
};
