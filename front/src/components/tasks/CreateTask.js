import React, { useState, useEffect, useContext } from 'react';
import UserService from "../../services/UserService.js";
import TaskService from "../../services/TaskService.js"
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
import { useHistory } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import { ProjectContext } from '../../context/ProjectContext';

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

    container: {
        width: 400
    }

}));

const CreateTask = ({ handleClose, taskStatus, taskId, projectId, add }) => {
    const { location, setRefreshActive, refreshActive, refreshBacklog, setRefreshBacklog } = useContext(ProjectContext);
    const classes = useStyles();
    const history = useHistory();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');
    const [userList, setUserList] = useState([]);
    const [userData, setUserData] = useState([]);




    // })

    useEffect(() => {
        setStatus(taskStatus);
        let isMounted;
        const fetchUsers = async () => {
            isMounted = true;
            if (isMounted) {
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
                        history.push(`/tasks/${projectId}`);
                    });
            }
        }
        const fetchData = async () => {
            isMounted = true;
            if (add === true) {
                return;
            } else {
                await TaskService.getTaskById(taskId).then(
                    response => {
                        if (isMounted) {
                            let task = response.data;

                            setName(task.name);
                            setStatus(task.status);
                            setDescription(task.description);
                            setPriority(task.priority);
                        }
                    })
                    .catch((error) => {
                        getErrorMessage();
                        history.push(`/tasks/${projectId}`);
                    }
                    );
            };
        }
        fetchData();
        //   fetchUsers();
        return () => { isMounted = false };
    }, [taskId]);

    const saveOrUpdatetask = (e) => {
        e.preventDefault();
        console.log(name)

        let taskCreate = { name: name, projectId: projectId, status: status, description: description, priority: priority };
        let taskUpdate = { name: name, status: status, description: description, priority: priority };
        //,usersId: userId };
        //  console.log('task=>' + JSON.stringify(task));
        if (add === true) {
            TaskService.createTask(taskCreate).then(res => {

                getSuccessMessage("added");
                if (location === 'active') {
                    handleClose();
                    setRefreshActive(!refreshActive);
                } else if (location === 'backlog') {
                    handleClose();
                    setRefreshBacklog(!refreshBacklog);
                } else {
                    history.push(`/tasks/${projectId}`);
                }

            })
                .catch((error) => {
                    getErrorMessage();
                    history.push(`/tasks/${projectId}`);

                }
                );
        } else {

            TaskService.updateTask(taskUpdate, taskId).then(res => {
                getSuccessMessage("updated");

                if (location === 'active') {
                    handleClose();
                    setRefreshActive(!refreshActive);
                } else if (location === 'backlog') {
                    handleClose();
                    setRefreshBacklog(!refreshBacklog);
                }
                else {
                    history.push(`/tasks/${projectId}`);
                }

            })
                .catch((error) => {
                    getErrorMessage();
                    history.push(`/tasks/${projectId}`);
                }
                );
        }
    }

    const getErrorMessage = () => {
        const errorMessage = swal({
            text: "Something went wrong! ",
            button: "Go back to task list",
            icon: "warning",
            dangerMode: true,
        });
        return errorMessage;
    }

    const getSuccessMessage = (status) => {
        const successMessage = swal({
            title: "Request successful",
            text: `The task has been ${status}`,
            icon: "success",
            button: "Go back to task list",
        });
        return successMessage;
    }

    const getTitle = () => {
        if (add == true) {
            return <h3 className="text-center">Add a new task</h3>
        }
        else {
            return <h3 className="text-center">Update the task</h3>
        }
    }

    // const handlePersonName = (event, value) => {
    //     setPersonName(value);
    // }

    const changeTitle = (event) => {
        setName(event.target.value);
    }

    const changeStatus = (event) => {
        setStatus(event.target.value);
    }

    const changeContent = (event) => {
        setDescription(event.target.value);
    }

    const changePriority = (event) => {
        setPriority(event.target.value);

    }
    const handleCancel = () => {
        handleClose();
    }

    return (
        <div>
            <ThemeProvider theme={theme}>
                <Container  style={{ padding:40, borderRadius: 5}} component="main" className={classes.container}>

                    <ValidatorForm onSubmit={saveOrUpdatetask}>

                        <Typography style={{ color: '#ffc814' }} component="div" variant="h5">{getTitle()}</Typography>

                        <TextValidator
                            variant="outlined"
                            margin="normal"
                            // required
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            id="name-task"
                            label="Task name"
                            name="task"
                            value={name}
                            inputProps={{ maxLength: 50 }}
                            // autoComplete="email"
                            validators={['required', 'matchRegexp:^([A-Za-z0-9,.!]+ )+[A-Za-z0-9,.!]+$|^[A-Za-z0-9,.!]+$']}
                            errorMessages={['this field is required']}
                            onChange={changeTitle}
                            autoFocus
                        />

                        <TextValidator
                            variant="outlined"
                            multiline
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            // required
                            fullWidth
                            id="filled-textarea-task"
                            label="Description"
                            name="description"
                            value={description}
                            // autoComplete="email"
                            //   validators={['required']}
                            //   errorMessages={['this field is required']}
                            onChange={changeContent}

                        />{add != true ? <FormControl required id="form-control">
                            <InputLabel id="demo-simple-select-label">Status</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={status}
                                onChange={changeStatus}
                            >
                                <MenuItem style={{ color: '#fa7857' }} value={`TODO`}><span style={{ color: '#fa7857' }}>TO DO</span></MenuItem>
                                <MenuItem style={{ color: '#ffc814' }} value={`IN_PROGRESS`}><span style={{ color: '#ffc814' }}>IN PROGRESS</span></MenuItem>
                                <MenuItem style={{ color: '#ccffbf' }} value={`DONE`}><span style={{ color: '#ccffbf' }}>DONE</span></MenuItem>
                                <MenuItem value={`BACKLOG`}><span >BACKLOG</span></MenuItem>

                            </Select>
                        </FormControl> : ''}

                        <FormControl required id="form-control">
                            <InputLabel id="demo-simple-select-label">Priority</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={priority}
                                onChange={changePriority}
                            >
                                <MenuItem style={{ color: '#ccffbf' }} value={`LOW`}><span style={{ color: '#ccffbf' }}>LOW</span></MenuItem>
                                <MenuItem style={{ color: '#ffc814' }} value={`MEDIUM`}><span style={{ color: '#ffc814' }}>MEDIUM</span></MenuItem>
                                <MenuItem style={{ color: '#fa7857' }} value={`HIGH`}><span style={{ color: '#fa7857' }}>HIGH</span></MenuItem>

                            </Select>
                        </FormControl>

                        {/* <FormControl id="form-control">
                            <InputLabel id="demo-mutiple-checkbox-label">Users</InputLabel>
                            <Select
                                labelId="demo-mutiple-checkbox-label"
                                id="demo-mutiple-checkbox"
                                multiple
                                value={state.personName}
                                onChange={handlePersonName}
                                input={<Input />}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}
                            >
                                {state.userList.map((name) => (
                                    <MenuItem key={name} value={name}>
                                        <Checkbox checked={state.personName.indexOf(name) > -1} />
                                        <ListItemText primary={name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl> */}

                        <Button id="submit-task-update-create-form" className={classes.submit} variant="contained"  type="submit" style={{ marginRight: '10px', color: '#d1a411' }}>Submit</Button>
                        <Button id="cancel-task-update-create-form" onClick={() => handleCancel()} className={classes.colorWhite} variant="contained">Cancel</Button>
                    </ValidatorForm>
                </Container>
            </ThemeProvider>

        </div>
    )
}

export default CreateTask