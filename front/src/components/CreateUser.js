import React, { useState, useEffect, useContext } from 'react'
import { Link, useHistory } from "react-router-dom";
import UserService from "../services/UserService";
import swal from 'sweetalert';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
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
        MuiChip: {
            deleteIcon: {
                color: '#d44a28',
                "&:hover": {
                    color: '#91341d'
                }

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
        MuiInput: {
            underline: {
                '&:before': {
                    borderBottom: '1px solid white',
                }
            }
        },
        MuiSelect: {
            icon: {
                color: 'white',
            },
            selectMenu: {
                backgroundColor: 'transparent',
            },
            listbox: {
                backgroundColor: 'transparent',
            },
            menuPaper: {
                backgroundColor: 'transparent',
            },
        },
        MuiIconButton: {
            label: {
                color: 'white'
            },
        },
        MuiMenu: {
            paper: {
                background: 'linear-gradient(to right, #27408b 30%, transparent)',
                backgroundColor: 'transparent',
            }
        },
        MuiButton:{
            contained: {
            backgroundColor: '#d44a28',
            '&:hover':{
                backgroundColor: 'transparent',
            }
        }
    }

    },
    palette: {
        primary: {
            main: '#ffffff',

        },
        secondary: {
            light: '#92ddea',
            main: '#d44a28',
            backgroundColor: '#fff',
        },
        default: {
            main: '#be9ddf',
            backgroundColor: '#fff',
        }
    },
});

const useStyles = makeStyles((theme) => ({
    root: {
        width: 400,
        '& > * + *': {
            marginTop: theme.spacing(3),
        },
    },
    colorWhite: {
        color: 'white',
    },
    submit:{
      
        backgroundColor: '#ffffff',
}
}));


function CreateUser({ match }) {

    const classes = useStyles();

    let history = useHistory();
    const [id, setId] = useState(match.params.id);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('ACTIVE');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [role, setRole] = useState('ROLE_USER');
    const [validForm, setValidForm] = useState(true);
    const {state} = useContext(AuthContext);

    useEffect(() => {

        if (id === '-1') {
            return;
        } else {

            UserService.getUserById(id).then((res) => {
                let user = res.data;
                setFirstName(user.firstName);
                setLastName(user.lastName);
                setEmail(user.email);
                setStatus(user.status);
                setRole(user.roles[0].name);
            
            })
                .catch((error) => {
                    getErrorMessage();
                    history.push('/projects');
                });
        }

    }, [])

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

    const saveOrUpdateUser = (e) => {
        e.preventDefault();
        let roleName = [];
        roleName.push(role);
     
        let user = { firstName: firstName, lastName: lastName, email: email, password: password, status: status, roles: roleName };
        if (id === '-1') {
            UserService.createUpdateUser(user, 0).then(res => {
                getSuccessMessage("added");
                history.push('/admin');
            })
                .catch((error) => {
                    getErrorMessage();
                    history.push('/admin');
                }
                );
        } else {
            UserService.createUpdateUser(user, id).then(res => {
                getSuccessMessage("updated");
                history.push('/admin')
            })
                .catch((error) => {
                    getErrorMessage();
                }
                );
        }
    }

    const getErrorMessage = () => {
        const errorMessage = swal({
            text: "Something went wrong! ",
            button: "Go back to user list",
            icon: "warning",
            dangerMode: true,
        });
        return errorMessage;
    }

    const getSuccessMessage = (status) => {
        const successMessage = swal({
            title: "Request successful",
            text: `The user has been ${status}`,
            icon: "success",
            button: "Go back to project list",
        });
        return successMessage;
    }

    const getTitle = () => {
        if (id === '-1') {
            return <h3 className="text-center">Add new user</h3>
        }
        else {
            return <h3 className="text-center">Update user</h3>
        }
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleRepeatPasswordChange = (e) => {
        setRepeatPassword(e.target.value);
    }

    const changeFirstName = (event) => {
        setFirstName(event.target.value);
    }
    const changeStatus = (event) => {
        setStatus(event.target.value);
    }
    const changeLastName = (event) => {
        setLastName(event.target.value);
    }
    const changeRole = (event) => {
        setRole(event.target.value);
    }

    return (
        <ThemeProvider theme={theme}>
            <Container style={{ backgroundColor: state.checkedA ? 'rgba(13, 17, 31, 0.514)' : 'transparent', padding:40, borderRadius: 5}}  component="main" maxWidth="xs" className={classes.root}>
                <ValidatorForm id="create-update-user-form" onSubmit={saveOrUpdateUser}>
                    <Typography style={{ color: '#ffc814' }} component="h1" variant="h5">{getTitle()}</Typography>
                    <TextValidator
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="user"
                        label="User name"
                        name="user"
                        value={firstName}
                        inputProps={{ maxLength: 50 }}
                        // autoComplete="email"
                        validators={['required', `matchRegexp:^[A-Z][a-z]+$`]}
                        errorMessages={['this field is required', 'Firstname is not valid. First letter should be capital - min 2 characters long']}
                        onChange={changeFirstName}
                        autoFocus
                    />
                    <TextValidator
                        variant="outlined"
                        margin="normal"
                        multiline
                        required
                        fullWidth
                        id="filled-textarea"
                        label="Last name"
                        name="lastName"
                        value={lastName}
                        // autoComplete="email"
                        validators={['required', `matchRegexp:^[A-Z][A-z]+$`]}
                        errorMessages={['this field is required', 'Lastname is not valid. First letter should be capital - min 2 characters long']}
                        onChange={changeLastName}
                    />
                    <TextValidator
                        variant="outlined"
                        required
                        margin="normal"
                        // required
                        fullWidth
                        id="email-create-user"
                        label="Email Address"
                        name="email"
                        value={email}
                        // autoComplete="email"
                        validators={['required', 'isEmail']}
                        errorMessages={['This field is required', 'Email is not valid']}
                        onChange={handleEmailChange}
                    />

                    <FormControl required id="form-control">
                        <InputLabel id="demo-simple-select-label">Status</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={status}
                            onChange={changeStatus}
                        >
                            <MenuItem style={{ color: '#63cf7f', backgroundColor: 'transparent' }} value={`ACTIVE`}><span style={{ color: '#ccffbf' }}>ACTIVE</span></MenuItem>
                            <MenuItem style={{ color: '#cf932b', backgroundColor: 'transparent' }} value={`PENDING`}><span style={{ color: '#ffc814' }}>PENDING</span></MenuItem>                          
                            <MenuItem style={{ color: '#e03b24', backgroundColor: 'transparent' }} value={`INACTIVE`}><span style={{ color: '#fa7857' }}>INACTIVE</span></MenuItem>

                        </Select>
                    </FormControl>
                    <FormControl required id="form-control">
                        <InputLabel id="demo-simple-select-label">Role</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={role}
                            onChange={changeRole}
                        >
                            <MenuItem style={{ backgroundColor: 'transparent' }} value={`ROLE_USER`}><span style={{ color: '#ffffff' }}>USER</span></MenuItem>
                            <MenuItem style={{ color: '#42a1ff', backgroundColor: 'transparent' }} value={`ROLE_MODERATOR`}><span style={{ color: '#42a1ff' }}>MODERATOR</span></MenuItem>
                            <MenuItem style={{ color: '#a52fcc', backgroundColor: 'transparent' }} value={`ROLE_ADMIN`}><span style={{ color: '#a52fcc' }}>ADMIN</span></MenuItem>

                        </Select>
                    </FormControl>

                    {id === '-1' && (<><TextValidator
                        variant="outlined"
                        required
                        margin="normal"
                        // required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password-create-user"
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
                        id="repeat-password-create-user"
                        value={repeatPassword}
                        error={!validForm}
                        validators={['isPasswordMatch', 'required', `matchRegexp:^(?=.{6,}$)(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).*$`]}
                        errorMessages={['Password mismatch', 'This field is required']}
                        onChange={handleRepeatPasswordChange}/></>)}

                    <Button id="submit-user-update-create-form" className={classes.submit} variant="contained"  type="submit" style={{ marginRight: '10px', color: '#d1a411'}}>Submit</Button>
                    <Link to={'/admin'} style={{ textDecoration: 'none' }}><Button id="cancel-user-update-create-form" className={classes.colorWhite} variant="contained">Cancel</Button></Link>
                </ValidatorForm>
            </Container>
        </ThemeProvider >
    )
}
export default CreateUser