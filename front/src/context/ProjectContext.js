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
    const [refreshProject, setRefreshProject] = useState(false);
    const [rowsPerPageJournal, setRowsPerPageJournal] = useState(5);
    const [pageJournal, setPageJournal] = useState(0);
    const [refreshJournal, setRefreshJournal] = useState(false);


    useEffect(() => {
        setRowsPerPage(5);
        setPage(0);
        setRowsPerPageJournal(5);
        setPageJournal(0);
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
                activeProject, setActiveProject,
                refreshProject, setRefreshProject,
                rowsPerPageJournal, setRowsPerPageJournal,
                pageJournal, setPageJournal,
                refreshJournal, setRefreshJournal

            }}
        >
            {children}
        </Provider>
    );
};
export { ProjectContext, ProjectContextProvider };