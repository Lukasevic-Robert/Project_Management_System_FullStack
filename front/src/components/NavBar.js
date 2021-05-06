import React, { useEffect, useState, useContext } from 'react';

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import {AuthContext} from '../context/AuthContext.js';


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

export default function NavBar() {

    const {isAdmin, isAuthenticated, isModerator, authUser, logout} = useContext(AuthContext);
    const classes = useStyles();
    const [showAdminBoard, setShowAdminBoard] = useState(false);
    const [showModeratorBoard, setShowModerator] = useState(false);
  
  
  
    useEffect(() => {
        setShowAdminBoard(isAdmin());
        setShowModerator(isModerator());
    }, [])
  

    return (
        <ThemeProvider theme={theme}>
        <div className={classes.root}>
        <AppBar position="static" style={{ background: '#7eb8da' }}>
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon color="white" />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              <Link style={{ color: 'white', fontSize: 20 }} className="nav-link" to={() => isAuthenticated() ? "/api/v1/projects" : "/api/auth/signin"}>Pro-Man</Link>
            </Typography>

            {isAdmin() && (
            <Link to={"/api/v1/test/admin"} style={{ color: '#92ddea' }} className="nav-link"><Button style={{ color: 'white' }}>ADMIN BOARD</Button></Link>
          )}
            {isAuthenticated() ? (
              <>
                <Link to={"/profile"} className="nav-link"><Button style={{ color: 'white' }}>{authUser.email}</Button></Link>
                <a href="/api/auth/signin" onClick={() => logout()} className="nav-link"><Button color="secondary">LogOut</Button></a>
              </>
            ) : (
              <>
                <Link className="nav-link" to={"/api/auth/signin"}><Button style={{ color: 'white' }}>LogIn</Button></Link>
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
      </ThemeProvider>
    )
}
