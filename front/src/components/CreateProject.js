import { render } from '@testing-library/react';
import React, {Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Link} from "react-router-dom";

class CreateProject extends Component {
state = {   
title: '',
content: ''
}

handleChange = (e) => {
    this.setState ({
        [e.target.id]: e.target.value
    })
}

handleSubmit = (e) =>{
    e.preventDefault();
    console.log(this.state);
}

render(){
return(
    <div className = "container">
        <form onSubmit = {this.handleSubmit} className="black">
          <h5 className = "grey-text text-darken-3">Create new project</h5>
          <div className = "input-field">
              <div>
              <label htmlFor="title">Title</label>
              </div>
              <input className = "projectDescribtion" placeholder = "Project name" type="text" id="title" onChange={this.handleChange}/>
          </div>
          <div className="input-field">
              <div>
              <br/>
              <label htmlFor="content">Project Content</label>
              </div>
            <textarea cols = "40" rows = "6" placeholder = "Describe your project here" id="content" className="
            projectDescription" onChange={this.handleChange}></textarea>
          </div>
          <div className="input-field">
              <button className ="button projectDescription lighten-1 z-depth-0" >Create</button>
              <button className ="cancelbtn projectDescription lighten-1 z-depth-0" ><Link to = {'/api/v1/test/user'}>Cancel</Link></button>
          </div>
        </form>
    </div>
)
}
}

export default CreateProject;