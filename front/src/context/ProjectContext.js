import React, { createContext, useState, useEffect } from 'react';

const ProjectContext = createContext();
const { Provider } = ProjectContext;

const ProjectContextProvider = ({ children }) => {

    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [refreshContext, setRefreshContext] = useState(false);
    const [refreshActive, setRefreshActive] = useState(false);
    const [refreshBacklog, setRefreshBacklog] = useState(false);
    const [activeProjectId, setActiveProjectId] = useState(localStorage.getItem('activeProjectId'));
    const [projectName, setProjectName] = useState(localStorage.getItem('activeProjectName'));
    const [activeProject, setActiveProject] = useState(JSON.parse(localStorage.getItem('activeProject')));
    const [location, setLocation] = useState('');

    useEffect(() => {
        setRowsPerPage(5);
        setPage(0);
    }, [refreshContext])

    return (
        <Provider
            value={{
                rowsPerPage, setRowsPerPage,
                page, setPage,
                refreshContext, setRefreshContext,
                activeProjectId, setActiveProjectId,
                projectName, setProjectName,
                location, setLocation,
                refreshActive, setRefreshActive,
                refreshBacklog, setRefreshBacklog,
                activeProject, setActiveProject

            }}
        >
            {children}
        </Provider>
    );
};
export { ProjectContext, ProjectContextProvider };