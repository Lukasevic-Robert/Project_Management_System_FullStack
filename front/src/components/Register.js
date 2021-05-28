import React, { useState, useContext, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
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
    },
    successMessage: {
        marginTop: theme.spacing(20),
    }
});

const API_URL = "http://localhost:8080/api/auth/";


export default function SignIn() {

    const value = useContext(AuthContext);
    const classes = useStyles();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState('');
    const [roles, setRoles] = useState('');
    const [message, setMessage] = useState("");
    const [errUnauthorized, setErrUnauthorized] = useState("");
    const [successMessage, setSuccessMessage] = useState();
    const [validForm, setValidForm] = useState(true);


    useEffect(() => {
        if (password !== repeatPassword) {
            setValidForm(false);
        } else {
            setValidForm(true);
        }

        ValidatorForm.addValidationRule('isPasswordMatch', (value) => { // bad solution, need to find better one
            if (validForm) {
                return false;
            }
            return true;
        });

        return () => {
            ValidatorForm.removeValidationRule('isPasswordMatch');
        }

    }, [password, repeatPassword])


    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleRepeatPasswordChange = (e) => {
        setRepeatPassword(e.target.value);
    }
    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
    }

    const handleLastNameChange = (e) => {
        setLastName(e.target.value);
    }

    const handleSubmit = (event) => {

        event.preventDefault();
        setMessage("");
        axios.post(API_URL + "signup", { firstName, lastName, email, password, roles })
            .then(response => {
                setSuccessMessage(response.data.message)
            }).catch(error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                setMessage(resMessage);
                setErrUnauthorized(error.response.status);
            })
    };


    return (!value.isAuthenticated() ? (
        <ThemeProvider theme={theme}>
            <Container style={{  backgroundColor: value.state.checkedA ? 'rgba(13, 17, 31, 0.514)' : 'transparent', padding:40, marginTop: -20, borderRadius: 5}} component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    {successMessage ? (<Typography style={{ marginTop: 200, textAlign: 'center', backgroundColor: 'transparent', border:'none' }} role="alert"><span style={{fontSize: '24px', color: 'white'}}>{successMessage}</span> <br /> <span style={{ color: '#ffc814', fontSize: '15px'}}>Admin must confirm your registration.</span><br /><Link href="/signin" variant="body2">{"Press here to Sign In!"}</Link></Typography>)
                        : (<><Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                            <Typography component="h1" color="primary" variant="h5">Sign up</Typography>
                            <ValidatorForm id="register-form" className={classes.form} onSubmit={handleSubmit}>
                                {(errUnauthorized === 403 || errUnauthorized === 401) && <div className="alert alert-danger" role="alert"> Please double-check the email and password you entered and try again.</div>}
                                {errUnauthorized === 400 && (<div className="alert alert-danger" role="alert">{message}</div>)}
                                <TextValidator
                                    variant="outlined"
                                    required
                                    margin="normal"
                                    // required
                                    fullWidth
                                    id="fname-register"
                                    label="First Name"
                                    name="fname"
                                    value={firstName}
                                    validators={['required', `matchRegexp:^[A-Z][a-z]+$`]}
                                    errorMessages={['This field is required', 'Firstname must be valid. First letter should be capital - min 2 characters long']}
                                    onChange={handleFirstNameChange}
                                    autoFocus

                                />
                                <TextValidator
                                    variant="outlined"
                                    required
                                    margin="normal"
                                    // required
                                    fullWidth
                                    id="lname-register"
                                    label="Last Name"
                                    name="lname"
                                    value={lastName}
                                    validators={['required', `matchRegexp:^[A-Z][a-z]+$`]}
                                    errorMessages={['This field is required', 'Lastname must be valid. First letter should be capital - min 2 characters long']}
                                    onChange={handleLastNameChange}

                                />
                                <TextValidator
                                    variant="outlined"
                                    required
                                    margin="normal"
                                    // required
                                    fullWidth
                                    id="email-register"
                                    label="Email Address"
                                    name="email"
                                    value={email}
                                    // autoComplete="email"
                                    validators={['required', 'isEmail']}
                                    errorMessages={['This field is required', 'Email is not valid']}
                                    onChange={handleEmailChange}
                                />

                                <TextValidator
                                    variant="outlined"
                                    required
                                    margin="normal"
                                    // required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password-register"
                                    value={password}
                                    validators={['required', `matchRegexp:^(?=.{6,}$)(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).*$`]}
                                    errorMessages={['This field is required', `Password must contain at least one digit, uppercase and lowercase letter - min 6 characters long`]}
                                    onChange={handlePasswordChange}
                                // autoComplete="current-password"
                                />
                                <TextValidator
                                    variant="outlined"
                                    required
                                    margin="normal"
                                    // required
                                    fullWidth
                                    name="repeatPassword"
                                    label="Repeat password"
                                    type="password"
                                    id="repeat-password-register"
                                    value={repeatPassword}
                                    error={!validForm}
                                    validators={['isPasswordMatch', 'required', `matchRegexp:^(?=.{6,}$)(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).*$`]}
                                    errorMessages={['Password mismatch', 'This field is required']}
                                    onChange={handleRepeatPasswordChange}
                                // autoComplete="current-password"
                                />
                                <Button
                                    id="register-submit"
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    className={classes.submit}
                                >
                                    <span className={classes.colorWhite}>Sign Up</span>
                                </Button>
                                <Grid container>
                                    {/* <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid> */}
                                    <Grid item>
                                        <Link href="/signin" variant="body2">
                                            {"Have an account? Sign In"}
                                        </Link>
                                    </Grid>
                                </Grid>
                            </ValidatorForm></>)}
                </div>
                <Box mt={5}>
                    <Copyright />
                </Box>
            </Container>
        </ThemeProvider>
    ) : (<Redirect to="/projects" />));
}