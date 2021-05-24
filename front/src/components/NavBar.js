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
import LayersIcon from '@material-ui/icons/Layers';
import logo from '../images/diamond-vector.png';
import Switch from '@material-ui/core/Switch';

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
  overrides: {

    MuiButton: {
      contained: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        '&:hover': {
          backgroundColor: 'transparent',
        },
      }

    },
    MuiSwitch: {

      backgroundColor: 'transparent',

    },
    MuiDrawer: {
      paper: {
        background: 'linear-gradient(#695586 30%, transparent 70%)',
        color: 'white',
        // backgroundColor: 'transparent',
        // backgroundImage: 'url(' + drawerImage + ')',
      },

    }
  }
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
    backgroundColor: 'transparent',
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
  projectName: {
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    maxWidth: '150px'
  }
}));


export default function NavBar() {

  let history = useHistory();
  const { isAdmin, isAuthenticated, authUser, logout, state, setState } = useContext(AuthContext);
  const { refreshContext, setRefreshContext, activeProjectId, projectName } = useContext(ProjectContext);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);


  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

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
          })} style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
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
              <Link id="nav-logo-link" style={{ color: 'white', fontSize: 20, fontFamily: 'Righteous' }} className="nav-link" to={() => isAuthenticated() ? "/projects" : "/signin"}><img style={{ width: 50 }} src={logo} alt="logo"></img> JawBreaker</Link>
            </Typography>
            <Switch
              size="small"
              checked={state.checkedA}
              color="primary"
              onChange={handleChange}
              name="checkedA"
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />

            {isAdmin() && (
              <Link id="link-to-admin" to={"/admin"} style={{ color: '#92ddea' }} className={classes.align}><Button variant="contained" style={{ color: 'white' }}>USER BOARD</Button></Link>
            )}

            {isAdmin() && (
              <Link id="link-to-admin" to={"/admin/journal"} style={{ color: '#92ddea' }}><Button variant="contained" style={{ color: 'white' }}>EVENT JOURNAL</Button></Link>
            )}

            {isAuthenticated() ? (
              <>
                <Link id="link-to-projects" to={"/projects"} className={isAdmin() ? '' : classes.align} style={{ color: '#92ddea' }} ><Button variant="contained" style={{ color: 'white' }}>PROJECTS</Button></Link>
                <Link id="link-to-profile" to={"/profile"} ><Button variant="contained" style={{ color: 'white' }}>{authUser.email}</Button></Link>
                <Button variant="contained" onClick={() => logOut()} style={{ color: '#ffa5d8' }}>LogOut</Button>
              </>
            ) : (
              <>
                <Link id="nav-link-to-signin" className={classes.align} to={"/signin"}><Button variant="contained" style={{ color: 'white' }}>LogIn</Button></Link>
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
          id="drawer"
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton id="handle-drawer" onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon style={{ color: 'white' }} /> : <ChevronRightIcon style={{ color: 'white' }} />}
            </IconButton>
          </div>
          <Divider style={{ backgroundColor: 'white' }} />
          <List>
            <ListItem id="button-to-projects-drawer" button key={1} onClick={() => handleRedirect('/projects')}><ListItemIcon><LayersOutlinedIcon style={{ color: 'white' }} /></ListItemIcon><ListItemText primary={'Projects'} /></ListItem>
          </List>
          <Divider style={{ backgroundColor: 'white' }} />
          {activeProjectId && (<>
            <ListItem id="button-name-projects-drawer" button key={1} onClick={() => handleRedirect(`/tasks/${activeProjectId}`)}><ListItemIcon><LayersIcon style={{ color: 'white' }} /></ListItemIcon><ListItemText className={classes.projectName} primary={`${projectName}`} /></ListItem>
            <ListItem id="button-to-backlog-drawer" button key={2} onClick={() => handleRedirect(`/backlog/${activeProjectId}`)}><ListItemIcon><ViewHeadlineOutlinedIcon style={{ color: 'white' }} /></ListItemIcon><ListItemText primary={'Backlog'} /></ListItem>
            <ListItem id="button-to-activeboard-drawer" button key={3} onClick={() => handleRedirect(`/active-board/${activeProjectId}`)}><ListItemIcon><ViewWeekOutlinedIcon style={{ color: 'white' }} /></ListItemIcon><ListItemText primary={'Active Board'} /></ListItem> </>)}
          {/* <List>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List> */}
        </Drawer>
        <main style={{ height: '100%', backgroundColor: 'transparent' }}
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div style={{ height: '100%', backgroundColor: 'transparent' }} className={classes.drawerHeader} />
          <Routes />
        </main>
      </div>
    </ThemeProvider>
  )
}
