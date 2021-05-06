import React, { useEffect, useState, useContext } from 'react';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Login from "./components/Login.js";
import BoardUser from './components/BoardUser.js';
import BoardAdmin from './components/BoardAdmin.js';
import Profile from './components/Profile.js';
import AuthService from "./services/authService.js";
import ProjectList from './components/ProjectList.js';
import CreateProject from './components/CreateProject.js';
import ViewProjectTasks from './components/ViewProjectTasks.js';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import NavBar from './components/NavBar.js';
import { AuthProvider, AuthContext } from './context/AuthContext';


const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#9579d1',

    },
    secondary: {
      light: '#92ddea',
      main: '#ffa5d8',
    },
  },
});




function App() {

  return (<Router>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <NavBar />
        <div className="auth-wrapper">
          <div className="auth-inner">
            <Switch>
              <Route exact path='/' component={Login} />
              <Route path="/api/auth/signin" component={Login} />
              <Route path="/api/v1/test/user" component={BoardUser} />
              <Route path="/api/v1/test/admin" component={BoardAdmin} />
              <Route path="/profile" component={Profile} />
              <Route exact path="/api/v1/projects" component={ProjectList} />
              <Route path="/api/v1/projects/:id" component={CreateProject} />
              <Route path="/api/v1/tasks/:id" component={ViewProjectTasks} />
            </Switch>
          </div>
        </div>
      </AuthProvider>
    </ThemeProvider>
  </Router >
  );
}

export default App;
