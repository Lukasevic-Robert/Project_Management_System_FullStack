import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext.js';

function Profile() {

 
    const {authUser} = useContext(AuthContext);


    return (
        <div style={{color: 'white'}} className="container">
            <header style={{backgroundColor: 'transparent', borderBottom: '1px solid #fff', borderRadius:0, height: '100px'}} className="jumbotron">
                <h3>
                    <strong>{authUser.email}</strong>
          </h3>
            </header>
            <p>
                <strong style={{color: '#ffc814'}}>Token:</strong>{" "}
                {authUser.token.substring(0, 20)} ...{" "}
                {authUser.token.substr(authUser.token.length - 20)}
            </p>
            <p>
                <strong style={{color: '#ffc814'}}>Id:</strong>{" "}
                {authUser.id}
            </p>
            <p>
                <strong style={{color: '#ffc814'}}>Email:</strong>{" "}
                {authUser.email}
            </p>
            <strong style={{color: '#ffc814'}}>Authorities:</strong>
            <ul>
                {authUser.roles &&
                    authUser.roles.map((role, index) => <li key={index}>{role}</li>)}
            </ul>
        </div>
    );
}
export default Profile;
