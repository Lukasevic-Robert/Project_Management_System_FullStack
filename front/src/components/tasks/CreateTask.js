import React, { useState, useEffect }  from 'react';
import { Link } from "react-router-dom";
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
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import ListItemText from '@material-ui/core/ListItemText';
import { useHistory } from 'react-router';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#7eb8da',
        },
        secondary: {
            light: '#92ddea',
            main: '#be9ddf',
            backgroundColor: '#fff',
        },
    },
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const CreateTask = ({taskId, paramProjectId, add}) => {
    const history = useHistory();
    const[name, setName]=useState('');
    const[description, setDescription]=useState('');
    const[status, setStatus]=useState('');
    const[priority, setPriority]=useState('');
    const [personName, setPersonName] = useState([]);
    const [userList, setUserList] = useState([]);
    const [userListId, setUserListId] = useState([]);
    const [userData, setUserData] = useState([]);


    // const [state, setState] = useState({
    //         name: '',
    //         description: [],
    //         status: '',
    //         priority: '',
    //         task: '',
    //         personName: [],
    //         userList: [],
    //         userListId: [],
    //         userData: [],
        
    // })

    useEffect(() => {
        let isMounted;
const fetchUsers= async() =>{
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
               history.push(`/tasks/${paramProjectId}`);
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
             // let users = [];
                // let userId = [];
                // task.users.map((user) => {
                //     users.push(user.firstName + ` ` + user.lastName);
                //     userId.push(user.id);
                // })
                setName(task.name);
                setStatus(task.status);
                // let descriptionTemp=[]
                // task.description.forEach((item)=>{
                //     descriptionTemp.push(item);
                // });
                // setDescription(descriptionTemp);
                setDescription(task.description);
                setPriority(task.priority);

            //  setState({ name: task.name, status: task.status, description: task.description, priority: task.priority})
                 //, personName: users, userListId: userId });
                    }
                })
                .catch((error) => {
                   getErrorMessage();
                   history.push(`/tasks/${paramProjectId}`);
                }
                );
        };}
        fetchData();
    //   fetchUsers();
        return () => { isMounted = false };
    }, [taskId]);

   const saveOrUpdatetask = (e) => {
        e.preventDefault();
        // let userId = [];
        // state.userData.map((user) => {
        //     let username = user.firstName + ` ` + user.lastName;
        //     if (state.personName.includes(username)) {
        //         userId.push(user.id);
        //     }
        // });

        // setState({ userListId: userId });

        let task = { name: name, description: description, priority: priority, projectId: paramProjectId};
       console.log(task)
            //,usersId: userId };
        //  console.log('task=>' + JSON.stringify(task));
        if (add === true) {
           TaskService.createTask(task).then(res => {
               console.log(res)
               
                getSuccessMessage("added");
                history.push(`/tasks/${paramProjectId}`);
             
            })
                .catch((error) => {
                   getErrorMessage();
                 history.push(`/tasks/${paramProjectId}`);

                }
                );
        } else {
            
            TaskService.updateTask(task, taskId).then(res => {
                getSuccessMessage("updated");

                history.push(`/tasks/${paramProjectId}`);

            })
                .catch((error) => {
                   getErrorMessage();
                   history.push(`/tasks/${paramProjectId}`);
                }
                );
        }
    }

    const getErrorMessage=()=> {
        const errorMessage = swal({
            text: "Something went wrong! ",
            button: "Go back to task list",
            icon: "warning",
            dangerMode: true,
        });
        return errorMessage;
    }

    const getSuccessMessage=(status)=> {
        const successMessage = swal({
            title: "Request successful",
            text: `The task has been ${status}`,
            icon: "success",
            button: "Go back to task list",
        });
        return successMessage;
    }

    const getTitle=()=> {
        if (add == true) {
            return <h3 className="text-center">Add a new task</h3>
        }
        else {
            return <h3 className="text-center">Update the task</h3>
        }
    }

    const handlePersonName = (event, value) => {
        setPersonName(value);
    }

   const changeTitle = (event) => {
       setName(event.target.value);
    }

    const changeStatus = (event) => {
        setStatus(event.target.value);
    }

    const changeContent = (event, value) => {
       setDescription(event)
    }

    const changePriority = (event) => {
        setPriority(event.target.value);
    }

    return (
        <div>
       <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">

                    <ValidatorForm onSubmit={saveOrUpdatetask}>

                        <Typography color="secondary" component="div" variant="h5">{getTitle()}</Typography>

                        <TextValidator
                            variant="outlined"
                            margin="normal"
                            // required
                            InputLabelProps={{shrink: true}}
                            fullWidth
                            id="task"
                            label="Task name"
                            name="task"
                            value={name}
                            // autoComplete="email"
                            validators={['required']}
                            errorMessages={['this field is required']}
                            onChange={changeTitle}
                            autoFocus
                        />

                        <TextValidator
                            variant="outlined"
                            multiline
                            margin="normal"
                            InputLabelProps={{shrink: true}}
                            // required
                            fullWidth
                           id="filled-textarea"
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
                                <MenuItem value={`TODO`}>TO DO</MenuItem>
                                <MenuItem value={`IN_PROGRESS`}>IN PROGRESS</MenuItem>
                                <MenuItem value={`DONE`}>DONE</MenuItem>
                                <MenuItem value={`BACKLOG`}>BACKLOG</MenuItem>

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
                                <MenuItem value={`LOW`}>LOW</MenuItem>
                                <MenuItem value={`MEDIUM`}>MEDIUM</MenuItem>
                                <MenuItem value={`HIGH`}>HIGH</MenuItem>

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
                        <Button id="icon" variant="contained" color="primary" type="submit" style={{ marginRight: '10px' }}>Submit</Button>
                        <Link to={`/tasks/${paramProjectId}`} style={{ textDecoration: 'none' }}><Button id="icon" variant="contained" color="secondary">Cancel</Button></Link>
                    </ValidatorForm>
                </Container>
            </ThemeProvider>

        </div>
    )
}

export default CreateTask
