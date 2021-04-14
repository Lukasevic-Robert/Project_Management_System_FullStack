import React, { useState, useEffect } from 'react'
import AuthService from "../services/authService.js";

function Profile() {

    const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());


    return (
        <div className="container">
            <header className="jumbotron">
                <h3>
                    <strong>{currentUser.email}</strong> Profile
          </h3>
            </header>
            <p>
                <strong>Token:</strong>{" "}
                {currentUser.token.substring(0, 20)} ...{" "}
                {currentUser.token.substr(currentUser.token.length - 20)}
            </p>
            <p>
                <strong>Id:</strong>{" "}
                {currentUser.id}
            </p>
            <p>
                <strong>Email:</strong>{" "}
                {currentUser.email}
            </p>
            <strong>Authorities:</strong>
            <ul>
                {currentUser.roles &&
                    currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
            </ul>
        </div>
    );
}
export default Profile;
