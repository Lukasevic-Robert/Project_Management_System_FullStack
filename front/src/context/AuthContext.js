import React, { createContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

const AuthContext = createContext();
const { Provider } = AuthContext;

const AuthProvider = ({ children }) => {
    const history = useHistory();
    const user = localStorage.getItem('user');

    const [authUser, setAuthState] = useState(
        user ? JSON.parse(user) : {}  
    );

    const setAuthInfo =  user  => {
        localStorage.setItem('user', JSON.stringify(user));
        setAuthState(getCurrentUser);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setAuthState({});
    //     history.push('/api/auth/signin');
    };

    const isAuthenticated = () => {
        return user ? true : false;
    };

    const isAdmin = () => {
        return user ? authUser.roles.includes("ROLE_ADMIN") : false;
    };
    const isModerator = () => {
        return user ? authUser.roles.includes("ROLE_MODERATOR") : false;
    }
    const getCurrentUser = () => {
        return JSON.parse(localStorage.getItem('user'));
      }

    return (
        <Provider
            value={{
                authUser,
                setAuthState: user => setAuthInfo(user),
                logout,
                isAuthenticated,
                isAdmin,
                isModerator,
                getCurrentUser
            }}
        >
            {children}
        </Provider>
    );
};

export { AuthContext, AuthProvider };