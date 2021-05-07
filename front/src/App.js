import React, { useEffect, useState, useContext } from 'react';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useParams } from "react-router-dom";
import Login from "./components/Login.js";
import BoardUser from './components/BoardUser.js';
import BoardAdmin from './components/BoardAdmin.js';
import Profile from './components/Profile.js';
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


const AdminRoute = ({ children, ...rest }) => {
  const value = useContext(AuthContext);
  return (
    <Route {...rest} render={() =>
      value.isAuthenticated() && value.isAdmin() ? (
        <>{children}</>
      ) : (
        <Redirect to="/" />
      )
    }
    ></Route>
  );
};

const ModeratorRoute = ({component: Component, ...rest }) => {
  const value = useContext(AuthContext);
  return (
    <Route {...rest} render={(props) =>{
      value.isAuthenticated() && (value.isModerator() || value.isAdmin()) ? (
        <><Component {...props} /></>
      ) : (
        <Redirect to="/" />
      )
    }
  }></Route>
  );
};

const AuthenticatedRoute = ({ children, ...rest }) => {
  const value = useContext(AuthContext);
  return (
    <Route {...rest} render={() =>
      value.isAuthenticated() ? (
        <>{children}</>
      ) : (
        <Redirect to="/signin" />
      )
    }
    ></Route>
  );
};

function App() {

  return (<Router>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <NavBar />
        <div className="auth-wrapper">
          <div className="auth-inner">
            <Switch>

              <Route exact path='/' component={Login} />
              <Route path="/signin" component={Login} />

              <AuthenticatedRoute path="/user">
                <BoardUser />
              </AuthenticatedRoute>

              <AdminRoute path="/admin">
                <BoardAdmin />
              </AdminRoute>

              <AuthenticatedRoute path="/profile">
                <Profile />
              </AuthenticatedRoute>

              <AuthenticatedRoute exact path="/projects">
                <ProjectList />
              </AuthenticatedRoute>

              <ModeratorRoute path="/projects/:id" component ={CreateProject}/>

              <AuthenticatedRoute path="/tasks/:id">
                <ViewProjectTasks />
              </AuthenticatedRoute>
              
            </Switch>
          </div>
        </div>
      </AuthProvider>
    </ThemeProvider>
  </Router >
  );
}

export default App;
