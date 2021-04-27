import React, { useEffect, useState } from 'react';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Login from "./components/Login.js";
import BoardUser from './components/BoardUser.js';
import BoardAdmin from './components/BoardAdmin.js';
import Profile from './components/Profile.js';
import AuthService from "./services/authService.js";
import ProjectList from './components/ProjectList.js';
import AddNewProject from './components/AddNewProject.js';
import ViewProjectTasks from './components/ViewProjectTasks.js';


function App() {

  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);


  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }
  }, [])

  const logOut = () => {
    AuthService.logout();
  }

  return (<Router>
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <Link className="navbar-brand" to={"/api/auth/signin"}>Jira-Copy</Link>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto">

              {showAdminBoard && (
                <li className="nav-item">
                  <Link to={"/api/v1/test/admin"} className="nav-link">
                    {currentUser.email} - ADMIN
                  </Link>
                </li>
              )}

              {currentUser && (
                <li className="nav-item">
                  <Link to={"/api/v1/test/user"} className="nav-link">
                  {currentUser.email} - USER
                </Link>
                </li>
              )}

              {currentUser ? (
                <div className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link to={"/profile"} className="nav-link">
                      {currentUser.username}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <a href="/api/auth/signin" className="nav-link" onClick={logOut}>
                      LogOut
                </a>
                  </li>
                </div>
              ) : (
                <div className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link className="nav-link" to={"/api/auth/signin"}>Login</Link>
                  </li>

                  {/* <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li> */}
                </div>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="auth-wrapper">
        <div className="auth-inner">
          <Switch>
            <Route exact path='/' component={Login} />
            <Route path="/api/auth/signin" component={Login} />
            <Route path="/api/v1/test/user" component={BoardUser} />
            <Route path="/api/v1/test/admin" component={BoardAdmin} />
            <Route path="/profile" component={Profile} />
            <Route path="/api/v1/projects" component={ProjectList} />
            <Route path="/projects/:id" component={AddNewProject}></Route>
              <Route path="/tasks/:id" component={ViewProjectTasks}></Route>
          </Switch>
        </div>
      </div>
    </div></Router>
  );
}

export default App;
