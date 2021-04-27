import { render } from '@testing-library/react';
import React, {Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Link} from "react-router-dom";
import UserService from "../services/UserService";
import { useState } from 'react'


class CreateProject extends Component {
    constructor(props) {
        super(props)
    
this.state = {   
    id: this.props.match.params.id,
title: '',
content: '',
status:''
}

this.saveOrUpdateProject=this.saveOrUpdateProject.bind(this);
this.changeTitle=this.changeTitle.bind(this);
this.changeStatus=this.changeStatus.bind(this);
this.changeContent=this.changeContent.bind(this);

let errorGettingProjects=false;
}


componentDidMount() {
    if (this.state.id == -1) {
        return;
    } else {
        
        UserService.getProjectById(this.state.id).then((res) => {
           let project = res.data;
                console.log(res.data);
                this.setState({ title: project.name, status: project.status, content: project.description });
           
        },error=>{
            alert("Error retrieving project")
            this.setErrorGettingProjects(true);
            console.log(this.errorGettingProjects);
        });
    }
}


setErrorGettingProjects(param){
    this.errorGettingProjects=param;

}

// getErrorGettingProjects(){
//     console.log(this.errorGettingProjects)
//     if(this.errorGettingProjects===true){
//     return <div className="alert alert-danger" role="alert"> Error viewing projects.</div>
//     // if(this.errorGettingProjects){ return <div className="alert alert-danger" role="alert"> Error viewing projects.</div> }

// }}
   
   

saveOrUpdateProject = (e) => {
    e.preventDefault();
    let project = { name: this.state.title, status: this.state.status, description: this.state.content };
    console.log('project=>' + JSON.stringify(project));
    if (this.state.id == -1) {
        UserService.createProject(project).then(res => {
             this.props.history.push('/api/v1/projects');}, error=>{
             alert('Error Adding A Project')}
            
        );
    } else {
        UserService.updateProject(project, this.state.id).then(res => {
           this.props.history.push('/api/v1/projects');},error=>{alert('Error Updating This Project')}
        );
    }
}

getTitle(){
    if(this.state.id==-1){
        return <h3 className="text-center">Add a new project</h3>
    }
    else{
      return  <h3 className="text-center">Update project</h3>
    }
}


handleChange = (e) => {
    this.setState ({
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

render(){
return(
    <div className = "container">
        {/* <div>
        {this.getErrorGettingProjects()} </div> */}
        <form onSubmit = {this.handleSubmit} className="black">
          <div className = "grey-text text-darken-3">{this.getTitle()}
          </div>
          <div className = "input-field">
              <div>
              <label htmlFor="title">Title</label>
              </div>
              <input className = "projectDescribtion" placeholder = "Project name" type="text" id="title" value={this.state.title} onChange={this.changeTitle}/>
          </div>
          <div className="input-field">
              <div>
              <br/>
              <label htmlFor="content">Project Content</label>
              </div>
            <textarea cols = "40" rows = "6" placeholder = "Describe your project here" id="content" className="
            projectDescription" value={this.state.content} onChange={this.changeContent}></textarea>
          </div>
          <div className="input-field">
              <button className ="button projectDescription lighten-1 z-depth-0" onClick={this.saveOrUpdateProject} style={{ marginRight: '10px' }}>Submit</button>
              <button className ="cancelbtn projectDescription lighten-1 z-depth-0" ><Link to = {'/api/v1/projects'} style={{ color: 'black', textDecoration: 'none'}}>Cancel</Link></button>
          </div>
        </form>
    </div>
)
}
}

export default CreateProject;