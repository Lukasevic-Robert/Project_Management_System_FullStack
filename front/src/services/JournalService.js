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
    
export default{
    getEntries,
};
