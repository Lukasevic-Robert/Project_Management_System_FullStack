import React, { useEffect, useState } from 'react';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Link, useHistory } from "react-router-dom";
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
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';


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

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
});


function App() {

  const classes = useStyles();
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
 <ThemeProvider theme={theme}>
    <div className={classes.root}>
      <AppBar position="static" style={{ background: '#7eb8da' }}>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon color="white"/>
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            <Link style={{ color: 'white', fontSize: 20 }} className="nav-link" to={"/api/auth/signin"}>Pro-Man</Link>
          </Typography>

          {/* {showAdminBoard && (
            <Link to={"/api/v1/test/admin"} style={{ color: '#92ddea' }} className="nav-link"><Button color="secondary">ADMIN BORAD</Button></Link>
          )} */}
          {currentUser ? (
            <>
              <Link to={"/profile"} className="nav-link"><Button style={{ color: 'white' }}>{currentUser.email}</Button></Link>
              <a href="/api/auth/signin" onClick={logOut} className="nav-link"><Button color="secondary">LogOut</Button></a>
            </>
          ) : (
            <>
              <Link className="nav-link" to={"/api/auth/signin"}><Button  style={{ color: 'white' }}>LogIn</Button></Link>
              {/* <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li> */}
            </>
          )}


        </Toolbar>
      </AppBar>
    </div>

    <div className="auth-wrapper">
      <div className="auth-inner">
        <Switch>
          <Route exact path='/' component={Login} />
          <Route path="/api/auth/signin" component={Login} />
          <Route path="/api/v1/test/user" component={BoardUser} />
          <Route path="/api/v1/test/admin" component={BoardAdmin} />
          <Route path="/profile" component={Profile} />
          <Route exact path="/api/v1/projects" component={ProjectList} />
          <Route path="/api/v1/projects/:id" component={CreateProject}></Route>
          <Route path="/api/v1/tasks/:id" component={ViewProjectTasks}></Route>
        </Switch>

      </div>
    </div>
    </ThemeProvider>
  </Router>
  );
}

export default App;
