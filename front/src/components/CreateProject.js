
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import UserService from "../services/UserService";
import swal from 'sweetalert';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';




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



class CreateProject extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id,
            title: '',
            content: '',
            status: ''
        }

        this.saveOrUpdateProject = this.saveOrUpdateProject.bind(this);
        this.changeTitle = this.changeTitle.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
        this.changeContent = this.changeContent.bind(this);
    }

    componentDidMount() {
        if (this.state.id == -1) {
            return;
        } else {

            UserService.getProjectById(this.state.id).then((res) => {
                let project = res.data;
                console.log(res.data);
                this.setState({ title: project.name, status: project.status, content: project.description });

            })
                .catch((error) => {
                    this.getErrorMessage();
                    this.props.history.push('/api/v1/projects');

                });
        }
    }


    saveOrUpdateProject = (e) => {
        e.preventDefault();
        let project = { name: this.state.title, status: this.state.status, description: this.state.content };
        //  console.log('project=>' + JSON.stringify(project));
        if (this.state.id == -1) {
            UserService.createProject(project).then(res => {
                this.getSuccessMessage("added");
                this.props.history.push('/api/v1/projects');
            })
                .catch((error) => {
                    this.getErrorMessage();
                    this.props.history.push('/api/v1/projects');
                }
                );
        } else {
            UserService.updateProject(project, this.state.id).then(res => {
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
        })
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
                            
                        />
                        <Button id="icon" variant="contained" color="primary" type="submit" style={{ marginRight: '10px' }}>Submit</Button>
                        <Link to={'/api/v1/projects'} style={{ textDecoration: 'none' }}><Button id="icon" variant="contained" color="secondary">Cancel</Button></Link>

                    </ValidatorForm>
                </Container>
            </ThemeProvider>
        )
    }
}

export default CreateProject;