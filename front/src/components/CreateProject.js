import React, { useState, useEffect, useContext } from 'react'
import { Link, useHistory } from "react-router-dom";
import UserService from "../services/UserService";
import ProjectService from "../services/ProjectService";
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
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from "@material-ui/core/styles";
import { ProjectContext } from './../context/ProjectContext';
import { AuthContext } from '../context/AuthContext.js';


const CustomAutocomplete = withStyles({
    tag: {
        backgroundColor: 'transparent',
        height: 30,
        color: "white",
        fontSize: "15px",
        variant: "outlined",
        position: "relative",
        border: "1px solid white",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
    },
    input: {
        backgroundColor: 'transparent',
    },
    listbox: {
        backgroundColor: 'transparent',
        color: 'white',
    },
    paper: {
        background: 'linear-gradient(to right, #27408b 30%, transparent)',
        backgroundColor: 'transparent',
    },
    popupIndicator: {
        color: 'white',
    }


})(Autocomplete);


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
    },
}));


function CreateProject({ match }) {

    const classes = useStyles();

    const { location, activeProjectId, setProjectName } = useContext(ProjectContext);
    const {state} = useContext(AuthContext);
    let history = useHistory();
    const [id, setId] = useState(match.params.id);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('');
    const [personName, setPersonName] = useState([]);
    const [userList, setUserList] = useState([]);
    const [userListId, setUserListId] = useState([]);
    const [userData, setUserData] = useState([]);

    const filterOptions = createFilterOptions({
        matchFrom: 'start',
        stringify: option => option
    });

    useEffect(() => {

        UserService.getUsers().then((res) => {
            let users = res.data;
            let userInfo = [];
            users.forEach((user) => {
                let fullname = user.firstName + ` ` + user.lastName;
                userInfo.push(fullname);
            })
            setUserList(userInfo);
            setUserData(users);

        })
            .catch((error) => {
                getErrorMessage();
                history.push('/projects');

            });

        if (id === '-1') {
            return;
        } else {

            ProjectService.getProjectById(id).then((res) => {
                let project = res.data;
                let users = [];
                let userId = [];
                project.users.forEach((user) => {
                    users.push(user.firstName + ` ` + user.lastName);
                    userId.push(user.id);
                })
                setTitle(project.name);
                setStatus(project.status);
                setContent(project.description);
                setPersonName(users);
                setUserListId(userId);
            })
                .catch((error) => {
                    getErrorMessage();
                    history.push('/projects');
                });
        }

    }, [])

    const saveOrUpdateProject = (e) => {
        e.preventDefault();
        let userId = [];
        userData.forEach((user) => {
            let username = user.firstName + ` ` + user.lastName;
            if (personName.includes(username)) {
                userId.push(user.id);
            }
        });

        setUserListId(userId);

        let project = { name: title, status: status, description: content, usersId: userId };
        //  console.log('project=>' + JSON.stringify(project));
        if (id === '-1') {
            ProjectService.createProject(project).then(res => {
                getSuccessMessage("added");
                history.push('/projects');
            })
                .catch((error) => {
                    getErrorMessage();
                    history.push('/projects');
                }
                );
        } else {
            ProjectService.updateProject(project, id).then(res => {
                getSuccessMessage("updated");
                setProjectName(title);
                if (activeProjectId && location === 'active') {
                    history.push(`/active-board/${activeProjectId}`)
                } else {
                    history.push('/projects');
                }
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
            button: "Go back to project list",
            icon: "warning",
            dangerMode: true,
        });
        return errorMessage;
    }

    const getSuccessMessage = (status) => {
        const successMessage = swal({
            title: "Request successful",
            text: `The project has been ${status}`,
            icon: "success",
            button: "Go back to project list",
        });
        return successMessage;
    }

    const getTitle = () => {
        if (id === '-1') {
            return <h3 className="text-center">Add a new project</h3>
        }
        else {
            return <h3 className="text-center">Update the project</h3>
        }
    }

    const handlePersonName = (event, value) => {
        setPersonName(value);
    }

    const changeTitle = (event) => {
        setTitle(event.target.value);
    }
    const changeStatus = (event) => {
        setStatus(event.target.value);
    }
    const changeContent = (event) => {
        setContent(event.target.value);
    }
    return (
        <ThemeProvider theme={theme}>
                <Container style={{ backgroundColor: state.checkedA ? '#695586' : 'transparent', padding:40, borderRadius: 5}} component="main" maxWidth="xs" className={classes.root}>
                    <ValidatorForm id="create-update-project-form" onSubmit={saveOrUpdateProject}>
                        <Typography style={{ color: '#ffc814' }} component="h1" variant="h5">{getTitle()}</Typography>
                        <TextValidator
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="project"
                            label="Project name"
                            name="project"
                            value={title}
                            inputProps={{ maxLength: 50 }}
                            // autoComplete="email"
                            validators={['required', 'matchRegexp:^([A-Za-z0-9]+ )+[A-Za-z0-9]+$|^[A-Za-z0-9]+$']}
                            errorMessages={['this field is required']}
                            onChange={changeTitle}
                            autoFocus
                        />
                        <TextValidator
                            variant="outlined"
                            margin="normal"
                            multiline
                            required
                            fullWidth
                            id="filled-textarea"
                            label="Description"
                            name="description"
                            value={content}
                            // autoComplete="email"
                            validators={['required']}
                            errorMessages={['this field is required']}
                            onChange={changeContent}
                        />
                        {id !== '-1' ? <FormControl required id="form-control">
                            <InputLabel id="demo-simple-select-label">Status</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={status}
                                onChange={changeStatus}
                            >
                                <MenuItem style={{ color: '#ff9b8a', backgroundColor: 'transparent' }} value={`ACTIVE`}><span style={{ color: '#ff9b8a' }}>ACTIVE</span></MenuItem>
                                <MenuItem style={{ color: '#ccffbf', backgroundColor: 'transparent' }} value={`DONE`}><span style={{ color: '#ccffbf' }}>DONE</span></MenuItem>
    
                            </Select>
                        </FormControl> : ''}
                        <FormControl style={{ maxWidth: 'xs' }} id="form-control">
                            <CustomAutocomplete
                                filterOptions={filterOptions}
                                multiple
                                id="tags-standard"
                                options={userList}
                                onChange={handlePersonName}
                                getOptionLabel={(option) => option}
                                value={personName}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="standard"
                                        label="Users"
                                        placeholder="Search"
                                    />
                                )}
                            />
                        </FormControl>
                        <Button id="submit-project-update-create-form" variant="contained" className={classes.submit}  type="submit" style={{ marginRight: '10px', color: '#0d47a1'}}>Submit</Button>
                        <Link to={activeProjectId && (location === 'active' ? `/active-board/${activeProjectId}` : '/projects')} style={{ textDecoration: 'none' }}><Button id="cancel-project-update-create-form" className={classes.colorWhite} variant="contained" >Cancel</Button></Link>
                    </ValidatorForm>
                </Container>
        </ThemeProvider>
    )
}
export default CreateProject
