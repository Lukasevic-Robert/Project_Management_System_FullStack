
import React, { Component } from 'react';
import { Link } from "react-router-dom";
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
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import ListItemText from '@material-ui/core/ListItemText';





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



class CreateProject extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id,
            title: '',
            content: '',
            status: '',
            personName: [],
            userList: [],
            userListId: [],
            userData: [],
        }

        this.saveOrUpdateProject = this.saveOrUpdateProject.bind(this);
        this.changeTitle = this.changeTitle.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
        this.changeContent = this.changeContent.bind(this);
        this.handlePersonName = this.handlePersonName.bind(this);
    }

    componentDidMount() {

        UserService.getUsers().then((res) => {
            let users = res.data;
            let userInfo = [];
            users.map((user) => {
                let fullname = user.firstName + ` ` + user.lastName;
                userInfo.push(fullname);
            })

            this.setState({ userList: userInfo, userData: users });

        })
            .catch((error) => {
                this.getErrorMessage();
                this.props.history.push('/api/v1/projects');

            });

        if (this.state.id == -1) {
            return;
        } else {

            ProjectService.getProjectById(this.state.id).then((res) => {
                let project = res.data;
                let users = [];
                let userId = [];
                project.users.map((user) => {
                    users.push(user.firstName + ` ` + user.lastName);
                    userId.push(user.id);
                })

                this.setState({ title: project.name, status: project.status, content: project.description, personName: users, userListId: userId });

            })
                .catch((error) => {
                    this.getErrorMessage();
                    this.props.history.push('/api/v1/projects');

                });
        }
    }


    saveOrUpdateProject = (e) => {
        e.preventDefault();
        let userId = [];
        this.state.userData.map((user) => {
            let username = user.firstName + ` ` + user.lastName;
            if (this.state.personName.includes(username)) {
                userId.push(user.id);
            }
        });

        this.setState({ userListId: userId });

        let project = { name: this.state.title, status: this.state.status, description: this.state.content, usersId: userId };
        //  console.log('project=>' + JSON.stringify(project));
        if (this.state.id == -1) {
            ProjectService.createProject(project).then(res => {
                this.getSuccessMessage("added");
                this.props.history.push('/api/v1/projects');
            })
                .catch((error) => {
                    this.getErrorMessage();
                    this.props.history.push('/api/v1/projects');
                }
                );
        } else {
            ProjectService.updateProject(project, this.state.id).then(res => {
                this.getSuccessMessage("updated");
                this.props.history.push('/api/v1/projects');
            })
                .catch((error) => {
                    this.getErrorMessage();
                }
                );
        }
    }

    getErrorMessage() {
        const errorMessage = swal({
            text: "Something went wrong! ",
            button: "Go back to project list",
            icon: "warning",
            dangerMode: true,
        });
        return errorMessage;
    }

    getSuccessMessage(status) {
        const successMessage = swal({
            title: "Request successful",
            text: `The project has been ${status}`,
            icon: "success",
            button: "Go back to project list",
        });
        return successMessage;
    }

    getTitle() {
        if (this.state.id == -1) {
            return <h3 className="text-center">Add a new project</h3>
        }
        else {
            return <h3 className="text-center">Update the project</h3>
        }
    }


    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    handlePersonName = (e) => {
        this.setState({
            personName: e.target.value
        });
    }

    changeTitle = (event) => {
        this.setState({ title: event.target.value });
    }
    changeStatus = (event) => {
        this.setState({ status: event.target.value });
    }
    changeContent = (event) => {
        this.setState({ content: event.target.value });
    }



    // handleSubmit = (e) =>{
    //     e.preventDefault();
    //     console.log(this.state);
    // }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="xs">

                    <ValidatorForm onSubmit={this.saveOrUpdateProject}>

                        <Typography color="secondary" component="h1" variant="h5">{this.getTitle()}</Typography>

                        <TextValidator
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="project"
                            label="Project name"
                            name="project"
                            value={this.state.title}
                            // autoComplete="email"
                            validators={['required']}
                            errorMessages={['this field is required']}
                            onChange={this.changeTitle}
                            autoFocus
                        />

                        <TextValidator
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="filled-textarea"
                            label="Description"
                            name="description"
                            value={this.state.content}
                            // autoComplete="email"
                            validators={['required']}
                            errorMessages={['this field is required']}
                            onChange={this.changeContent}

                        />{this.state.id != -1 ? <FormControl required id="form-control">
                            <InputLabel id="demo-simple-select-label">Status</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={this.state.status}
                                onChange={this.changeStatus}
                            >
                                <MenuItem value={`ACTIVE`}>ACTIVE</MenuItem>
                                <MenuItem value={`DONE`}>DONE</MenuItem>

                            </Select>
                        </FormControl> : ''}
                        <FormControl id="form-control">
                            <InputLabel id="demo-mutiple-checkbox-label">Users</InputLabel>
                            <Select
                                labelId="demo-mutiple-checkbox-label"
                                id="demo-mutiple-checkbox"
                                multiple
                                value={this.state.personName}
                                onChange={this.handlePersonName}
                                input={<Input />}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}
                            >
                                {this.state.userList.map((name) => (
                                    <MenuItem key={name} value={name}>
                                        <Checkbox checked={this.state.personName.indexOf(name) > -1} />
                                        <ListItemText primary={name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button id="icon" variant="contained" color="primary" type="submit" style={{ marginRight: '10px' }}>Submit</Button>
                        <Link to={'/api/v1/projects'} style={{ textDecoration: 'none' }}><Button id="icon" variant="contained" color="secondary">Cancel</Button></Link>

                    </ValidatorForm>
                </Container>
            </ThemeProvider>
        )
    }
}

export default CreateProject;