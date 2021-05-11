import React, { createContext, useState, useEffect } from 'react';

const ProjectContext = createContext();
const { Provider } = ProjectContext;

const ProjectContextProvider = ({ children }) => {

    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);
    const [refreshContext, setRefreshContext] = useState(false);
    const [activeProject, setActiveProject] = useState();
    const [projectName, setProjectName] = useState();

    useEffect(() => {
        setRowsPerPage(5);
        setPage(0);
    }, [refreshContext])

    return (
        <Provider
            value={{
                rowsPerPage,
                setRowsPerPage,
                page,
                setPage,
                refreshContext,
                setRefreshContext,
                activeProject,
                setActiveProject,
                projectName,
                setProjectName
            }}
        >
            {children}
        </Provider>
    );
};
export { ProjectContext, ProjectContextProvider };