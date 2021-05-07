import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext.js';

function Profile() {

 
    const {authUser} = useContext(AuthContext);


    return (
        <div className="container">
            <header className="jumbotron">
                <h3>
                    <strong>{authUser.email}</strong> Profile
          </h3>
            </header>
            <p>
                <strong>Token:</strong>{" "}
                {authUser.token.substring(0, 20)} ...{" "}
                {authUser.token.substr(authUser.token.length - 20)}
            </p>
            <p>
                <strong>Id:</strong>{" "}
                {authUser.id}
            </p>
            <p>
                <strong>Email:</strong>{" "}
                {authUser.email}
            </p>
            <strong>Authorities:</strong>
            <ul>
                {authUser.roles &&
                    authUser.roles.map((role, index) => <li key={index}>{role}</li>)}
            </ul>
        </div>
    );
}
export default Profile;
