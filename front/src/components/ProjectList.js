import React, { useContext, useState, useEffect } from 'react';
import '../Projects.css'
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button, DialogTitle, DialogActions, Dialog, Fab } from '@material-ui/core';
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
    }
});

function ProjectList() {

    let history = useHistory();

    const { rowsPerPage, setRowsPerPage, page, setPage, setActiveProject } = useContext(ProjectContext);
    const value = useContext(AuthContext);

    const [projectBoss, setProjectBoss] = useState(false);
    const classes = useStyles();
    const [projects, setProjects] = useState([]);
    const [responseData, setResponseData] = useState([]);
    const [elementCount, setElementCount] = useState(1);
    const [errorsFromBack, setErrorsFromBack] = useState([]);
    const [refresh, setRefresh] = useState(false);



    // GET PROJECTS from database ==========================>
    useEffect(() => {

        getProjects();
        setActiveProject('');
        checkAuthorization();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, rowsPerPage, refresh])


    const getProjects = async () => {

        await ProjectService.getProjects(page, rowsPerPage).then(
            response => {

                setResponseData(response.data);
                setProjects(response.data.content);
                setElementCount(response.data.totalElements);

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
    const deleteProject = (id) => {
        ProjectService.deleteProject(id).then(res => {
            getSuccessMessage("deleted");
            if(projects.length === 1  && page > 0){
                setPage(page - 1);
            }
            setRefresh(!refresh);
        })
            .catch((error) => {
                getErrorMessage();
            }
            );

        handleClose();
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

    // project delete confirmation dialog

    const [open, setOpen] = React.useState(false);
    const [deleteId, setDeleteId] = React.useState(0);
    const [deleteName, setDeleteName] = React.useState(0);

    const handleClickOpen = (rowId, rowName) => {
        setOpen(true);
        setDeleteId(rowId);
        setDeleteName(rowName);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleRedirect = (rowId) => {
        history.push(`/tasks/${rowId}`);
    }

    // end project delete confirmation dialog

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

    return (

        <ThemeProvider theme={theme}>
            <Paper className="table-container">
                <TableContainer >
                    <div className="projectHeadingStyle">
                        {projectBoss && (
                            <Link to={`/projects/-1`}>
                                <Fab size="medium" color="primary" className={classes.fab + ' ' + classes.create}>
                                    <AddIcon id="icon" />
                                </Fab>
                            </Link>)}
                    </div>
                    <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow id="table-head" >
                                <TableCell id="table-cell" >NAME</TableCell>
                                <TableCell id="table-cell" align="center">DESCRIPTION</TableCell>
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

                                        <TableCell onClick={() => handleRedirect(row.id)} style={{ cursor: 'pointer' }}><span>{row.name}</span></TableCell>

                                        <TableCell align="center">{row.description}</TableCell>
                                        <TableCell align="center"><span style={{ color: row.status === 'ACTIVE' ? '#cf932b' : '#63cf7f' }}>{row.status}</span></TableCell>
                                        <TableCell align="center">{row.taskCount}</TableCell>
                                        <TableCell align="center">{row.undoneTaskCount}</TableCell>
                                        {projectBoss && (
                                            <TableCell align="right">

                                                <Fab size="small" color="secondary" onClick={() => history.push(`/projects/${row.id}`)} aria-label="Edit" className={classes.fab}>
                                                    <EditIcon id="icon"></EditIcon>
                                                </Fab>


                                                <Fab id="delete-button" size="small" aria-label="Delete" className={classes.fab} onClick={() => handleClickOpen(row.id, row.name)}>
                                                    <DeleteIcon id="icon" />
                                                </Fab>

                                                <Dialog
                                                    open={open}
                                                    onClose={handleClose}
                                                    aria-labelledby="alert-dialog-title"
                                                    aria-describedby="alert-dialog-description">
                                                    <DialogTitle id="alert-dialog-title">{`Are you sure you want to delete project: ${deleteName}?`}</DialogTitle>

                                                    <DialogActions>
                                                        <Button onClick={handleClose} color="primary">CANCEL</Button>
                                                        <Button onClick={() => deleteProject(deleteId)} color="primary" autoFocus>OK</Button>
                                                    </DialogActions>
                                                </Dialog>
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