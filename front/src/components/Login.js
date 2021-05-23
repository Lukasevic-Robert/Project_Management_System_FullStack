import React, { useState, useContext } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { FormControlLabel } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import axios from "axios";
import { AuthContext } from '../context/AuthContext.js';



const theme = createMuiTheme({
  overrides: {
    MuiFormHelperText: {
      root: {
          '&.Mui-error': {
              color: '#ff9b8a'
          }
      }
  },
  MuiFormLabel: {
      root: {
          '&.Mui-error': {
              color: '#ff9b8a'
          }
      },
      asterisk: {
          '&.Mui-error': {
              color: '#ff9b8a'
          }
      }
  },

    MuiButton: {
      contained: {
        background: 'linear-gradient(to right, #ffc814 30%, transparent)',
        backgroundColor: 'transparent',

        // boxShadow: 'none',
        '&:hover': {
          backgroundColor: 'transparent',
        },
      }

    },
    MuiInputBase: {
      root: {
        backgroundColor: 'transparent',
      }
    },

    MuiInputLabel: {
      root: {
        color: 'white',
      },
    },
    MuiOutlinedInput: {
      root: {
          borderColor: 'white',
          color: 'white',
          '&.Mui-error': {
              color: '#ff9b8a',
              '& $notchedOutline': {
                  borderColor: '#ff9b8a',
              }
          },
      },
      notchedOutline: {
          borderColor: 'white',
      },
  },

  },
  palette: {
    primary: {
      main: '#ffffff',

    },
    secondary: {
      light: '#92ddea',
      main: '#ffc814',
      backgroundColor: '#fff',
    },
  },
});


function Copyright() {
  return (
    <Typography variant="body2" color="primary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/Lukasevic-Robert/Project_Management_System_FullStack">
        Spring Rebellion
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles({
  paper: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: 'transparent',
    color: '#ffc814'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  colorWhite: {
    color: 'white'
  }
});

const API_URL = "http://localhost:8080/api/auth/";


export default function SignIn() {

  const value = useContext(AuthContext);
  const history = useHistory();
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errUnauthorized, setErrUnauthorized] = useState("");


  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  }
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }

  const handleSubmit = (event) => {

    event.preventDefault();
    setMessage("");
    axios.post(API_URL + "signin", { email, password })
      .then(response => {
        if (response.data.token) {
          value.setAuthState(response.data);
          history.push("/projects");
        }
      }).catch(error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log();
        setMessage(error.response.data);
        setErrUnauthorized(error.response.status);
      })
  };


  return (!value.isAuthenticated() ? (
    <ThemeProvider theme={theme}>
      <Container style={{ backgroundColor: value.state.checkedA ? '#695586' : 'transparent', padding:40, borderRadius: 5}} component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography color="primary" component="h1" variant="h5">
            Sign in
        </Typography>

          <ValidatorForm id="login-form" className={classes.form} onSubmit={handleSubmit}>
            {(errUnauthorized === 403 || errUnauthorized === 401 || errUnauthorized === 423) && <div className="alert alert-danger" role="alert">{message}</div>}

            <TextValidator
              variant="outlined"
              margin="normal"
              // required
              fullWidth
              id="email-login"
              label="Email Address"
              name="email"
              value={email}
              // autoComplete="email"
              validators={['required', 'isEmail']}
              errorMessages={['This field is required', 'Email is not valid']}
              onChange={handleEmailChange}
              autoFocus
            />
            <TextValidator
              variant="outlined"
              margin="normal"
              // required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password-login"
              value={password}
              validators={['required']}
              errorMessages={['This field is required']}
              onChange={handlePasswordChange}
            // autoComplete="current-password"
            />
            {/* <FormControlLabel id="remember-me"
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              id="login-submit"
              type="submit"
              fullWidth
              variant="contained"
              className={classes.submit}
            >
              <span className={classes.colorWhite}>Sign In</span>
            </Button>
            <Grid container>
              {/* <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid> */}
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </ValidatorForm>

        </div>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Container>
    </ThemeProvider>
  ) : (<Redirect to="/projects" />));
}