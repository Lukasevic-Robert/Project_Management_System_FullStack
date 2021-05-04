import axios from "axios";
import React, { useContext } from "react"
import { UserContext } from "./UserContext";

const API_URL = "http://localhost:8080/api/auth/";

class authService {
  login(email, password) {
    console.log("authService - login method " + email + " : " + password);
    return axios
      .post(API_URL + "signin", {
        email,
        password
      })
      .then(response => {
        if (response.data.token) {
          console.log("authService: " + response.data)
          localStorage.setItem("user", JSON.stringify(response.data));
          console.log(JSON.parse(localStorage.getItem('user')));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username, email, password) {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
}

export default new authService();
