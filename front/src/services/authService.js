import axios from "axios";
import React, { useContext } from "react"
import { UserContext } from "./UserContext";

const API_URL = "http://localhost:8080/api/auth/";

class authService {

  register(username, email, password) {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new authService();
