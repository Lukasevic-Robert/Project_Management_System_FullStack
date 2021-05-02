import React, { isValidElement, useState } from 'react';
import { useHistory } from 'react-router-dom';
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
import AuthService from '../services/authService';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { FormControlLabel } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';


const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#7eb8da',

        },
        secondary: {
            light: '#92ddea',
            main: '#ffa5d8',
            backgroundColor: '#fff',
        },
    },
});


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
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
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});


export default function SignIn() {
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
    AuthService.login(email, password).then(
      () => {
                // changed to /projects, initial version: history.push("/profile");

        history.push("/api/v1/projects");
        window.location.reload();
      }, error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setMessage(resMessage);
        setErrUnauthorized(error.response.status);
      }
    ).catch(() => { });
  };


  return (
    <ThemeProvider theme={theme}>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar color="secondary" className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>

        <ValidatorForm className={classes.form} onSubmit={handleSubmit}>
        {(errUnauthorized===403||errUnauthorized===401)&&<div className="alert alert-danger" role="alert"> Please double-check the email and password you entered and try again.</div>}

          <TextValidator
            variant="outlined"
            margin="normal"
            // required
            fullWidth
            id="email"
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
            id="password"
            value={password}
            validators={['required']}
            errorMessages={['This field is required']}
            onChange={handlePasswordChange}
            // autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            <span id="icon">Sign In</span>
          </Button>
          <Grid container>
            {/* <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid> */}
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </ValidatorForm>

      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
    </ThemeProvider>
  );
}