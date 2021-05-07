import React, { createContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
    const history = useHistory();
    const user = localStorage.getItem('user');
    const url = "http://localhost:8080/api/";

    const [authUser, setAuthState] = useState(
        user ? JSON.parse(user) : {}  
    );

    const setAuthInfo =  user  => {
        localStorage.setItem('user', JSON.stringify(user));
        setAuthState(user);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setAuthState({});
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
                getCurrentUser
            }}
        >
            {children}
        </Provider>
    );
};

export { AuthContext, AuthProvider };