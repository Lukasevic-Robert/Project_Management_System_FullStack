import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';
import { BsFillEyeFill, BsTrash, BsPencil } from "react-icons/bs";
import { useState, useEffect } from 'react'
import UserService from "../services/UserService";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import axios from 'axios';  
import authHeader from '../services/authHeader';
import CreateProject from './CreateProject';
import { Link } from "react-router-dom";
import swal from 'sweetalert';




const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

export default function ProjectList() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const classes = useStyles();
    const [projects, setProjects] = useState([]);
    const [responseData, setResponseData] = useState([]);
    const [elementCount, setElementCount] = useState(1);
    const [errorsFromBack, setErrorsFromBack] = useState([]);


    //     const [projects, setProjects] = useState([
    //         {id:1,
    //         name:"P1",
    //     description:"descr",
    // status:"done",
    // totalTasks:5,
    // unfinishedTasks:2}
    //     ]);




    // GET PROJECTS from database ==========================>
    useEffect(() => {
        getProjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, rowsPerPage])


    const getProjects = async () => {

        await UserService.getProjects(page, rowsPerPage).then(
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
 UserService.deleteProject(id).then(res => {
    getSuccessMessage("deleted");
        setProjects(projects.filter((project) => project.id !== id))
    })
        .catch((error) => {
            getErrorMessage();
        }
        );

 handleClose();
}

const getErrorMessage=()=> {
    const errorMessage = swal({
        text: "Something went wrong! ",
        button: "Go back to project list",
        icon: "warning",
        dangerMode: true,
    });
    return errorMessage;
}

const getSuccessMessage=(status)=> {
    const successMessage= swal({
         title: "Request successful",
         text: `The project has been ${status}`,
         icon: "success",
         button: "Go back to project list",
     });
     return successMessage;
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

    // end project delete confirmation dialog

    return (
        <div>
            <Paper className={classes.paper}>
                <TableContainer>
                    <div className="projectHeadingStyle">
                        <p>Project List
                    </p>
                        {/* <button onClick={() => addProject() className="btn btn-success" >Add new project</button> */}
                        {/* <Tooltip title="Add" aria-label="add">
  <Fab color="primary" className={classes.fab}>
    <AddIcon />
  </Fab> */}

   <Link to={`/api/v1/projects/-1`}>
                        <button className="btn btn-success btn-sm">Add new</button>
                        </Link>
                    </div>
                    <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Description</TableCell>
                                <TableCell align="right">Status</TableCell>
                                <TableCell align="right">Total tasks</TableCell>
                                <TableCell align="right">Unfinished tasks</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                (projects.slice(0, rowsPerPage)).map((row) => (

                                    <TableRow key={row.id}>
                                        <TableCell component="th" scope="row">{row.name}</TableCell>
                                        <TableCell align="right">{row.description}</TableCell>
                                        <TableCell align="right">{row.status}</TableCell>
                                        <TableCell align="right">{row.taskCount}</TableCell>
                                        <TableCell align="right">{row.undoneTaskCount}</TableCell>
                                        <TableCell align="right">

                                        <Link to={`/api/v1/tasks/${row.id}`}>
                                                <BsFillEyeFill size={20} style={{ color: 'green', cursor: 'pointer' }} />
                                                </Link>

                                                <BsTrash size={20} style={{ color: 'red', cursor: 'pointer' }} onClick={() =>handleClickOpen(row.id, row.name)} />
                                        
                                                <Dialog
                                                    open={open}
                                                    onClose={handleClose}
                                                    aria-labelledby="alert-dialog-title"
                                                    aria-describedby="alert-dialog-description">
                                                    <DialogTitle id="alert-dialog-title">{`Are you sure you want to delete project: ${deleteName}?`}</DialogTitle>

                                                    <DialogActions>
                                                        <Button onClick={handleClose} color="primary"></Button>
                                                        <Button onClick={() => deleteProject(deleteId)} color="primary" autoFocus>OK</Button>
                                                    </DialogActions>
                                                </Dialog>

                                                <Link to={`/api/v1/projects/${row.id}`}>
                                                <BsPencil size={20} style={{ color: 'blue', cursor: 'pointer' }} />
                                            </Link>

                                        </TableCell>
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
        </div>
    );
}
