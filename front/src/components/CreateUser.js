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





const theme = createMuiTheme({

    overrides: {
        MuiChip: {
            deleteIcon: {
                color: '#be9ddf',
                "&:hover": {
                    color: '#8d6dad'
                }

            }
        },
    },
    palette: {
        primary: {
            main: '#7eb8da',

        },
        secondary: {
            light: '#92ddea',
            main: '#be9ddf',
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
    }
}));


function CreateUser({ match }) {

    const classes = useStyles();

    let history = useHistory();
    const [id, setId] = useState(match.params.id);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const [password, setPassword] = useState('');
    const [roles, setRoles] = useState([]);

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
                setRoles(user.roles);
            })
                .catch((error) => {
                    getErrorMessage();
                    history.push('/projects');
                });
        }

    }, [])

    const saveOrUpdateUser = (e) => {
        e.preventDefault();


        let user = { firstName: firstName, lastName: lastName, password: password, status: status, roles: roles };
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
            return <h3 className="text-center">Add a new user</h3>
        }
        else {
            return <h3 className="text-center">Update the user</h3>
        }
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
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs" className={classes.root}>
                <ValidatorForm id="create-update-user-form" onSubmit={saveOrUpdateUser}>
                    <Typography color="secondary" component="h1" variant="h5">{getTitle()}</Typography>
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
                        validators={['required', 'matchRegexp:^([A-Za-z0-9]+ )+[A-Za-z0-9]+$|^[A-Za-z0-9]+$']}
                        errorMessages={['this field is required']}
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
                        validators={['required']}
                        errorMessages={['this field is required']}
                        onChange={changeLastName}
                    />
                    {id !== '-1' ? <FormControl required id="form-control">
                        <InputLabel id="demo-simple-select-label">Status</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={status}
                            onChange={changeStatus}
                        >
                            <MenuItem style={{ color: '#cf932b', backgroundColor: 'transparent' }} value={`PENDING`}><span style={{ color: '#cf932b' }}>PENDING</span></MenuItem>
                            <MenuItem style={{ color: '#cf932b', backgroundColor: 'transparent' }} value={`ACTIVE`}><span style={{ color: '#cf932b' }}>ACTIVE</span></MenuItem>
                            <MenuItem style={{ color: '#63cf7f', backgroundColor: 'transparent' }} value={`DONE`}><span style={{ color: '#63cf7f' }}>INACTIVE</span></MenuItem>

                        </Select>
                    </FormControl> : ''}

                    <Button id="submit-user-update-create-form" className={classes.colorWhite} variant="contained" color="primary" type="submit" style={{ marginRight: '10px' }}>Submit</Button>
                    <Link to={'/admin'} style={{ textDecoration: 'none' }}><Button id="cancel-user-update-create-form" className={classes.colorWhite} variant="contained" color="secondary">Cancel</Button></Link>
                </ValidatorForm>
            </Container>
        </ThemeProvider>
    )
}
export default CreateUser