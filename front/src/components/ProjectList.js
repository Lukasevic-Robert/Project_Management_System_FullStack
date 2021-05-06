import React from 'react';
import '../Projects.css'
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button, DialogTitle, DialogActions, Dialog, Fab } from '@material-ui/core';
import { useState, useEffect } from 'react';
import UserService from "../services/UserService";
import ProjectService from "../services/ProjectService";
import { Link, useHistory } from "react-router-dom";
import swal from 'sweetalert';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import AddIcon from '@material-ui/icons/Add';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';


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
    }
});

function ProjectList() {
    let history = useHistory();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const classes = useStyles();
    const [projects, setProjects] = useState([]);
    const [responseData, setResponseData] = useState([]);
    const [elementCount, setElementCount] = useState(1);
    const [errorsFromBack, setErrorsFromBack] = useState([]);
    const [refresh, setRefresh] = useState(false);



    // GET PROJECTS from database ==========================>
    useEffect(() => {
        
        getProjects();
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
        history.push(`/api/v1/tasks/${rowId}`);
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

    return (
        <div>

            <ThemeProvider theme={theme}>
                <TableContainer component={Paper}>
                    <div className="projectHeadingStyle">

                        <Link to={`/api/v1/projects/-1`}>
                            <Fab size="medium" color="primary" className={classes.fab + ' ' + classes.create}>
                                <AddIcon id="icon"/>
                            </Fab>
                        </Link>
                    </div>
                    <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow id="table-head" >
                                <TableCell id="table-cell" >NAME</TableCell>
                                <TableCell id="table-cell" align="right">DESCRIPTION</TableCell>
                                <TableCell id="table-cell" align="right">STATUS</TableCell>
                                <TableCell id="table-cell" align="right">TOTAL TASKS</TableCell>
                                <TableCell id="table-cell" align="right">TODO TASKS</TableCell>
                                <TableCell id="table-cell" align="right">ACTIONS</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                (projects).map((row) => (

                                    <TableRow key={row.id}>

                                        <TableCell onClick={() => handleRedirect(row.id)} style={{ cursor: 'pointer' }}>{row.name}</TableCell>

                                        <TableCell align="right">{row.description}</TableCell>
                                        <TableCell align="right">{row.status}</TableCell>
                                        <TableCell align="right">{row.taskCount}</TableCell>
                                        <TableCell align="right">{row.undoneTaskCount}</TableCell>
                                        <TableCell align="right">
                                            <Link to={`/api/v1/projects/${row.id}`}>
                                                <Fab size="small" color="secondary" aria-label="Edit" className={classes.fab}>
                                                    <EditIcon id="icon"></EditIcon>
                                                </Fab>
                                            </Link>
                                            <Fab id="delete-button" size="small" aria-label="Delete" className={classes.fab} onClick={() => handleClickOpen(row.id, row.name)}><DeleteIcon id="icon" /></Fab>
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
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </ThemeProvider>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={elementCount}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />

        </div>
    );
}

export default ProjectList;