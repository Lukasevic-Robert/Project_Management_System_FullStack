import React, { useContext } from 'react';

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Switch, Route, Redirect } from "react-router-dom";
import Login from "./Login.js";
import Register from './Register.js'
import BoardUser from './BoardUser.js';
import BoardAdmin from './adminBoard/BoardAdmin.js';
import Profile from './Profile.js';
import ProjectList from './ProjectList.js';
import CreateProject from './CreateProject.js';
import ViewProjectTasks from './ViewProjectTasks.js';
import { AuthContext } from '../context/AuthContext';
import ActiveBoard from './dashboard/ActiveBoard';
import CreateTask from './tasks/CreateTask';
import BacklogTasks from './backlog/BacklogTasks';
import CreateUser from './CreateUser.js'


const AdminRoute = ({ component: Component, ...rest }) => {
    const value = useContext(AuthContext);
    return (
        <Route {...rest} render={(props) =>
            value.isAuthenticated() && value.isAdmin() ? (
                <Component {...props} />
            ) : (
                <Redirect to="/" />
            )
        }
        ></Route>
    );
};

const ModeratorRoute = ({ component: Component, ...rest }) => {
    const value = useContext(AuthContext);
    return (
        <Route {...rest} render={(props) =>
            value.isAuthenticated() && (value.isModerator() || value.isAdmin()) ? (
                <Component {...props} />
            ) : (
                <Redirect to="/" />
            )
        }
        ></Route>
    );
};

const AuthenticatedRoute = ({ component: Component, ...rest }) => {
    const value = useContext(AuthContext);
    return (
        <Route {...rest} render={(props) =>
            value.isAuthenticated() ? (
                <Component {...props} />
            ) : (
                <Redirect to="/signin" />
            )
        }
        ></Route>
    );
};

function Routes() {
    return (

        <div className="auth-wrapper">
            <div className="auth-inner">
                <Switch>

                    <Route exact path='/' component={Login} />
                    <Route path="/signin" component={Login} />
                    <Route path="/signup" component={Register} />

                    <AuthenticatedRoute path="/user" component={BoardUser} />

                    <AdminRoute exact path="/admin" component={BoardAdmin} />
                    <AdminRoute path="/admin/create-user/:id" component={CreateUser} />

                    <AuthenticatedRoute path="/profile" component={Profile} />

                    <AuthenticatedRoute exact path="/projects" component={ProjectList} />

                    <ModeratorRoute path="/projects/:id" component={CreateProject} />

                    <AuthenticatedRoute path="/tasks/:id" component={ViewProjectTasks} />

                    <AuthenticatedRoute exact path="/active-board/:id" component={ActiveBoard} />

                    <AuthenticatedRoute path="/tasks/:id/:taskid" component={CreateTask} />

                    <AuthenticatedRoute path="/backlog/:id" component={BacklogTasks} />

                </Switch>
            </div>
        </div>
    )
}
export default Routes;