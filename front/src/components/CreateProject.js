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


const CustomAutocomplete = withStyles({
    tag: {
        backgroundColor: 'transparent',
        height: 30,
        color: "#5c99bd",
        fontSize: "15px",
        variant: "outlined",
        position: "relative",
        border: "1px solid #be9ddf",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
    },

})(Autocomplete);


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


function CreateProject({ match }) {

    const classes = useStyles();

    const { location, activeProject } = useContext(ProjectContext);
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
                if (activeProject && location === 'active') {
                    history.push(`/active-board/${activeProject}`)
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
            <Container component="main" maxWidth="xs" className={classes.root}>
                <ValidatorForm id="create-update-project-form" onSubmit={saveOrUpdateProject}>
                    <Typography color="secondary" component="h1" variant="h5">{getTitle()}</Typography>
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
                        validators={['required']}
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
                            <MenuItem style={{ color: '#cf932b', backgroundColor: 'transparent' }} value={`ACTIVE`}><span style={{ color: '#cf932b' }}>ACTIVE</span></MenuItem>
                            <MenuItem style={{ color: '#63cf7f', backgroundColor: 'transparent' }} value={`DONE`}><span style={{ color: '#63cf7f' }}>DONE</span></MenuItem>

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
                    <Button id="submit-project-update-create-form" className={classes.colorWhite} variant="contained" color="primary" type="submit" style={{ marginRight: '10px' }}>Submit</Button>
                    <Link to={activeProject && (location === 'active' ? `/active-board/${activeProject}` : '/projects')} style={{ textDecoration: 'none' }}><Button id="cancel-project-update-create-form" className={classes.colorWhite} variant="contained" color="secondary">Cancel</Button></Link>
                </ValidatorForm>
            </Container>
        </ThemeProvider>
    )
}
export default CreateProject
