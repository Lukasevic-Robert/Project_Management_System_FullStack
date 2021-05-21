import axios from "axios";


const API_URL = "http://localhost:8080/api/auth/";

class authService {

  register(firstName, lastName, email, password, roles) {
    return axios.post(API_URL + "signup", {
      firstName,
      lastName,
      email,
      password,
      roles
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new authService();
