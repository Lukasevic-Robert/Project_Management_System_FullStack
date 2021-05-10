import React, { useContext } from 'react';
import Routes from './Routes';
import { Link, useHistory } from "react-router-dom";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../Navbar.css';
import clsx from 'clsx';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { AuthContext } from '../context/AuthContext.js';
import { ProjectContext } from '../context/ProjectContext.js';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LayersOutlinedIcon from '@material-ui/icons/LayersOutlined';
import ViewWeekOutlinedIcon from '@material-ui/icons/ViewWeekOutlined';
import ViewHeadlineOutlinedIcon from '@material-ui/icons/ViewHeadlineOutlined';
import logo from '../images/jawbreaker.png';

const drawerWidth = 240;


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

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
  },
  title: {
    '&:hover': {
     fontWeight: 800
    },
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),

  },
  align: {
    marginLeft: 'auto',
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));


export default function NavBar() {

  let history = useHistory();
  const { isAdmin, isAuthenticated, authUser, logout } = useContext(AuthContext);
  const { refreshContext, setRefreshContext, activeProject } = useContext(ProjectContext);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const logOut = () => {
    setRefreshContext(!refreshContext);
    handleDrawerClose();
    logout();
  }

  const handleRedirect = (path) => {
    history.push(path);
  }



  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })} style={{ background: '#7eb8da' }}>
          <Toolbar>
            {isAuthenticated() && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, open && classes.hide)}
              >
                <MenuIcon />
              </IconButton>)}
            <Typography variant="h6" className={classes.title}>
              <Link style={{ color: 'white', fontSize: 20, fontFamily: 'Righteous' }} className="nav-link" to={() => isAuthenticated() ? "/projects" : "/signin"}><img style={{ width: 30 }} src={logo} alt="logo"></img> JawBreaker</Link>
            </Typography>

            {isAdmin() && (
              <Link to={"/admin"} style={{ color: '#92ddea' }} className={classes.align}><Button style={{ color: 'white' }}>ADMIN BOARD</Button></Link>
            )}
            {isAuthenticated() ? (
              <>
                <Link to={"/profile"} className={classes.align}><Button style={{ color: 'white' }}>{authUser.email}</Button></Link>
                <Button onClick={() => logOut()} color="secondary">LogOut</Button>
              </>
            ) : (
              <>
                <Link className={classes.align} to={"/signin"}><Button style={{ color: 'white' }}>LogIn</Button></Link>
                {/* <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li> */}
              </>
            )}

          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </div>
          <Divider />
          <List>
            <ListItem button key={1} onClick={() => handleRedirect('/projects')}><ListItemIcon><LayersOutlinedIcon /></ListItemIcon><ListItemText primary={'Projects'} /></ListItem>
           

          </List>
          <Divider />
          {activeProject && (<>
            <ListItem button key={2} onClick={() => handleRedirect(`/backlog/${activeProject}`)}><ListItemIcon><ViewHeadlineOutlinedIcon /></ListItemIcon><ListItemText primary={'Backlog'} /></ListItem>
            <ListItem button key={3} onClick={() => handleRedirect(`/active-board/${activeProject}`)}><ListItemIcon><ViewWeekOutlinedIcon /></ListItemIcon><ListItemText primary={'Active Board'} /></ListItem> </>)}
          {/* <List>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List> */}
        </Drawer>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
          <Routes />
        </main>
      </div>
    </ThemeProvider>
  )
}
