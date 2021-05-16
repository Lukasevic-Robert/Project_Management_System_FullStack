import React, { useContext, useState, useEffect } from 'react';
import '../Projects.css'
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button, Fab } from '@material-ui/core';
import ProjectService from "../services/ProjectService.js";
import { Link, useHistory } from "react-router-dom";
import swal from 'sweetalert';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import AddIcon from '@material-ui/icons/Add';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { ProjectContext } from '../context/ProjectContext.js';
import { AuthContext } from '../context/AuthContext.js';



const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#be9ddf',
        },
        secondary: {
            main: '#ffa5d8',
        },
    },
});



const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    fab: {
        margin: 5,
    },
    create: {
        marginLeft: 20,
    },
    tableRow: {
        height: 60,
    },
    colorWhite: {
        color: 'white'
    },
    filterProjects: {
        marginLeft: 10,
        textTransform: 'none',
        backgroundColor: '#f5f4f4',
        border: 'none',
        '&:hover': {
            backgroundColor: '#dddbdb',
        }
    },
    description: {
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        maxWidth: '150px'
    },
    projectName: {
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        maxWidth: '150px'
    }
});

function ProjectList() {

    let history = useHistory();

    const { rowsPerPage, setRowsPerPage, page, setPage, setActiveProjectId, setProjectName, setActiveProject, refreshProject, setRefreshProject } = useContext(ProjectContext);
    const value = useContext(AuthContext);

    const [projectBoss, setProjectBoss] = useState(false);
    const classes = useStyles();
    const [projects, setProjects] = useState([]);
    const [responseData, setResponseData] = useState([]);
    const [elementCount, setElementCount] = useState(1);
    const [errorsFromBack, setErrorsFromBack] = useState([]);
    const [filtered, setFiltered] = useState(false);



    // GET PROJECTS from database ==========================>
    useEffect(() => {

        if (!filtered) {
            getProjects();
            setActiveProjectId('');
            checkAuthorization();
        } else {
            getProjectsByUser();
            setActiveProjectId('');
            checkAuthorization();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, rowsPerPage, refreshProject, filtered])


    const getProjects = async () => {

        await ProjectService.getProjects(page, rowsPerPage).then(
            response => {

                setResponseData(response.data);
                setProjects(response.data.content);
                setElementCount(response.data.totalElements);

                // setUsersId(response.data.content.users.id);

            },
            error => {
                setErrorsFromBack((error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                    error.message ||
                    error.toString())
            }
        );
    }

    const getProjectsByUser = async () => {

        await ProjectService.getProjectsByUser(page, rowsPerPage).then(
            response => {

                setResponseData(response.data);
                setProjects(response.data.content);
                setElementCount(response.data.totalElements);

                // setUsersId(response.data.content.users.id);

            },
            error => {
                setErrorsFromBack((error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                    error.message ||
                    error.toString())
            }
        );
    }

    // DELETE a project ==================================>

    const deleteFunction = (id, projectName) =>{
        swal({
            text: `Are you sure you want to delete project: ${projectName}?`,
            // text: "You won't be able to revert this!",
            icon: 'warning',
            className: "swalFont",
            buttons: ["Cancel", "Yes, delete it!"],
            // buttons: true,
            dangerMode: true,
            }).then( async (isConfirm)=>{
              if (isConfirm) {
                await  ProjectService.deleteProject(id).then(res => {
                    getSuccessMessage("deleted");
                    if (projects.length === 1 && page > 0) {
                        setPage(page - 1);
                    }
                    setRefreshProject(!refreshProject);
                })
                    .catch((error) => {
                        getErrorMessage();
                    }
                    );
              }
            })  
    }


    // PAGINATION =========================================>
    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(event.target.value);
        setPage(0);
    };


    // const emptyRows = rowsPerPage - Math.min(rowsPerPage, projects.length - page * rowsPerPage);
    // end paging

 

    const handleRedirect = (row) => {

        let usersId = [];
        row.users.map((user) => {
            usersId.push(user.id);
        })

        if (projectBoss || (usersId.includes(value.getCurrentUser().id) && row.status === 'ACTIVE')) {
            localStorage.setItem('activeProjectId', JSON.stringify(row.id));
            localStorage.setItem('activeProjectName', row.name);
            localStorage.setItem('activeProject', JSON.stringify(row))
            setActiveProjectId(row.id);
            setProjectName(row.name);
            setActiveProject(row);
            history.push(`/backlog/${row.id}`);
        } else {
            history.push(`/tasks/${row.id}`);
        }
    }

    const getErrorMessage = () => {
        const errorMessage = swal({
            text: "Something went wrong! ",
            button: "Go back to project list",
            icon: "warning",
            dangerMode: true,
        });
        return errorMessage;
    }

    const getSuccessMessage = (status) => {
        const successMessage = swal({
            title: "Request successful",
            text: `The project has been ${status}`,
            icon: "success",
            button: "Go back to project list",
        });
        return successMessage;
    }

    const checkAuthorization = () => {
        if (value.isProjectBoss()) {
            setProjectBoss(true);
        };
    }

    const changeFiltered = () => {
        setFiltered(!filtered);
    }

    return (

        <ThemeProvider theme={theme}>
            <Paper className="table-container">
                <TableContainer >
                    <div className="projectHeadingStyle">
                        {projectBoss && (
                            <Link to={`/projects/-1`}>
                                <Fab size="medium" color="primary" className={classes.fab + ' ' + classes.create}>
                                    <AddIcon className={classes.colorWhite} id="add-project-button" />
                                </Fab>
                            </Link>)}
                        <Button id="filter-project-by-user" onClick={changeFiltered} className={classes.filterProjects} variant="outlined"><span style={{ fontFamily: 'M PLUS 1p', fontSize: 15 }}>{!filtered ? <>Only My Projects</> : <>Show All Projects</>}</span></Button>
                    </div>
                    <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow id="table-head" >
                                <TableCell id="table-cell" >NAME</TableCell>
                                <TableCell className={classes.description} id="table-cell" align="center">DESCRIPTION</TableCell>
                                <TableCell id="table-cell" align="center">STATUS</TableCell>
                                <TableCell id="table-cell" align="center">TOTAL TASKS</TableCell>
                                <TableCell id="table-cell" align="center">TODO TASKS</TableCell>
                                {projectBoss && (
                                    <TableCell id="table-cell" align="right">ACTIONS</TableCell>)}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                (projects).map((row) => (

                                    <TableRow key={row.id} className={classes.tableRow}>

                                        <TableCell className={classes.projectName} onClick={() => handleRedirect(row)} style={{ cursor: 'pointer' }}><span>{row.name}</span></TableCell>

                                        <TableCell className={classes.description} align="center">{row.description}</TableCell>
                                        <TableCell align="center"><span style={{ color: row.status === 'ACTIVE' ? '#cf932b' : '#63cf7f' }}>{row.status}</span></TableCell>
                                        <TableCell align="center">{row.taskCount}</TableCell>
                                        <TableCell align="center">{row.undoneTaskCount}</TableCell>
                                        {projectBoss && (
                                            <TableCell align="right">

                                                <Fab id="link-to-edit-projects1" size="small" color="secondary" onClick={() => history.push(`/projects/${row.id}`)} aria-label="Edit" className={classes.fab}>
                                                    <EditIcon className={classes.colorWhite}></EditIcon>
                                                </Fab>


                                                <Fab id="delete-project-button" size="small" aria-label="Delete" className={classes.fab} onClick={() => deleteFunction(row.id, row.name)}>
                                                    <DeleteIcon className={classes.colorWhite} />
                                                </Fab>

                                                
                                            </TableCell>)}

                                    </TableRow>
                                ))}
                        </TableBody>

                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={elementCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
        </ThemeProvider>

    );
}

export default ProjectList;