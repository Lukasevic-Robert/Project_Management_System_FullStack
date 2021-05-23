import React, { createContext, useState } from 'react';
import { useHistory } from "react-router-dom";

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {

    const user = localStorage.getItem('user');
    const url = "http://localhost:8080/api/";
    let history = useHistory();

    const [authUser, setAuthState] = useState(
        user ? JSON.parse(user) : {}  
    );
    const [state, setState] = React.useState({
        checkedA: true,
        checkedB: true,
      });

    const setAuthInfo =  user  => {
        localStorage.setItem('user', JSON.stringify(user));
        setAuthState(user);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setAuthState({});
        history.push('/signin');
    };

    const isAuthenticated = () => {
        return user ? true : false;
    };

    const isAdmin = () => {
        return user && authUser.roles.includes("ROLE_ADMIN");
    };
    const isModerator = () => {
        return user && authUser.roles.includes("ROLE_MODERATOR");
    }
    const isProjectBoss = () => {
        if(isAdmin() || isModerator()){
            return true;
        }
    }

    const getCurrentUser = () => {
        return JSON.parse(localStorage.getItem('user'));
      }

    return (
        <Provider
            value={{
                url,
                authUser,
                setAuthState: user => setAuthInfo(user),
                logout,
                isAuthenticated,
                isAdmin,
                isModerator,
                isProjectBoss,
                getCurrentUser,
                state, setState
            }}
        >
            {children}
        </Provider>
    );
};

export { AuthContext, AuthProvider };