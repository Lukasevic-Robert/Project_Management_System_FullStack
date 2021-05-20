import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext();
const { Provider } = UserContext;

function UserContextProvider({ children }) {
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [refreshContext, setRefreshContext] = useState(false);
    const [refreshUsers, setRefreshUsers] = useState(false);

    return (
        <Provider value={{
            rowsPerPage, setRowsPerPage,
            page, setPage,
            refreshContext, setRefreshContext,
            refreshUsers, setRefreshUsers
        }}>
            {children}
        </Provider>
    )
}
export { UserContext, UserContextProvider }
