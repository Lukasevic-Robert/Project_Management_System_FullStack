import React, { useContext } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Login from "./components/Login.js";
import BoardUser from './components/BoardUser.js';
import BoardAdmin from './components/BoardAdmin.js';
import Profile from './components/Profile.js';
import ProjectList from './components/ProjectList.js';
import CreateProject from './components/CreateProject.js';
import ViewProjectTasks from './components/ViewProjectTasks';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import NavBar from './components/NavBar.js';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ProjectContextProvider } from './context/ProjectContext';
import ViewTask from './components/dashboard/ViewTask.js';
import ActiveBoard from './components/dashboard/ActiveBoard';
import CreateTask from './components/tasks/CreateTask';
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

const ModeratorRoute = ({ component: Component, ...rest }) => {
  const value = useContext(AuthContext);
  return (
    <Route {...rest} render={(props) =>
      value.isAuthenticated() && (value.isModerator() || value.isAdmin()) ? (
         <Component {...props} />
      ) : (
        <Redirect to="/" />
      )
    }
    ></Route>
  );
};

const AuthenticatedRoute = ({ component: Component, ...rest }) => {
  const value = useContext(AuthContext);
  return (
    <Route {...rest} render={(props) =>
      value.isAuthenticated() ? (
        <Component {...props} />
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
        <ProjectContextProvider>
          <NavBar />
          <div className="auth-wrapper">
            <div className="auth-inner">
              <Switch>

                <Route exact path='/' component={Login} />
                <Route path="/signin" component={Login} />

                <AuthenticatedRoute path="/user" component={BoardUser}/>

                <AdminRoute path="/admin" component={BoardAdmin}/>

                <AuthenticatedRoute path="/profile" component={Profile}/>


                <AuthenticatedRoute exact path="/projects" component={ProjectList}/>          

                <ModeratorRoute path="/projects/:id" component={CreateProject} />

                <AuthenticatedRoute exact path="/tasks/:id" component={ViewProjectTasks} />

                <AuthenticatedRoute exact path="/:id/tasks/active" component={ActiveBoard} />

            <AuthenticatedRoute path="/tasks/:id/:taskid" component={CreateTask} /> 

              </Switch>
            </div>
          </div>
        </ProjectContextProvider>
      </AuthProvider>
    </ThemeProvider>
  </Router >
  );
}

export default App;
