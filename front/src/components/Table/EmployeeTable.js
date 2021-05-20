import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import UserService from "../../services/UserService.js";
import '../../Projects.css'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button, DialogTitle, DialogActions, Dialog, Fab } from '@material-ui/core';
import ProjectService from "../../services/ProjectService.js";
import { useHistory } from "react-router-dom";
import swal from 'sweetalert';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import AddIcon from '@material-ui/icons/Add';
import { UserContext } from '../../context/UserContext.js';
import { AuthContext } from '../../context/AuthContext.js';
import SaveIcon from '@material-ui/icons/Save';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';



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
    createButton: {
        textTransform: 'none',
        color: 'white',
    },
    tableRow: {
        height: 60,
    },
    colorWhite: {
        color: 'white'
    },
    filterProjects: {
        marginLeft: 10,
        height: 40,
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
    },

    button: {
        margin: theme.spacing(1),
        color: 'white',
        marginLeft: 'auto'
    },
    margin: {
        margin: theme.spacing(1),
    },
    search: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 200,
        marginLeft: 10,
        height: 40,
        border: '1px solid #dddbdb',
        boxShadow: 'none',
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'Fira Sans'
    },
    iconButton: {
        padding: 10,
        '&:hover': {
            color: '#9c6ccc',
        }
    },
});


export default function EmployeeTable() {

    const { rowsPerPage, setRowsPerPage, page, setPage, refreshUsers, setRefreshUsers } = useContext(UserContext);
    let history = useHistory();
    const classes = useStyles();
    const [data, setData] = useState([]);
    const [elementCount, setElementCount] = useState(1);


    useEffect(() => {

        getUsers();

    }, [page, rowsPerPage, refreshUsers])


    const getUsers = () => {
        UserService.getUserPage(page, rowsPerPage).then((res) => {
            let users = res.data.content;
            setData(users);
            console.log(res.data)
            setElementCount(res.data.totalElements);
        })
            .catch((error) => {
                getErrorMessage();
                history.push('/projects');

            });
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(event.target.value);
        setPage(0);
    };

    const getErrorMessage = () => {
        const errorMessage = swal({
            text: "Something went wrong! ",
            button: "Go back to user list",
            icon: "warning",
            dangerMode: true,
        });
        return errorMessage;
    }

    const getSuccessMessage = (status) => {
        const successMessage = swal({
            title: "Request successful",
            text: `The user has been ${status}`,
            icon: "success",
            button: "Go back to user list",
        });
        return successMessage;
    }

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
    
    const deleteUser = (id) => {

        UserService.deleteUser(id).then(res => {
            getSuccessMessage("deleted");

            if (data.length === 1 && page > 0) {
                setPage(page - 1);
            }
            setRefreshUsers(!refreshUsers);
        })
            .catch((error) => {
                getErrorMessage();
            }
            );

        handleClose();
    }


    return (
        <ThemeProvider theme={theme}>
            <Paper className="table-container">
                <TableContainer >
                    <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow id="table-head" >
                                <TableCell id="table-cell" >ID</TableCell>
                                <TableCell id="table-cell" align="center">NAME</TableCell>
                                <TableCell id="table-cell" align="center">E-MAIL</TableCell>
                                <TableCell id="table-cell" align="center">STATUS</TableCell>
                                <TableCell id="table-cell" align="right">ACTIONS</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                (data).map((row) => (
                                    <TableRow key={row.id} className={classes.tableRow}>
                                        <TableCell >{row.id}</TableCell>
                                        <TableCell align="center">{row.firstName + ` ` + row.lastName}</TableCell>
                                        <TableCell align="center">{row.email}</TableCell>
                                        <TableCell align="center">{row.status}</TableCell>
                                        <TableCell align="right">

                                            <Fab id="link-to-edit-projects1" size="small" color="secondary" onClick={() => history.push(`/admin/create-user/${row.id}`)} aria-label="Edit" className={classes.fab}>
                                                <EditIcon className={classes.colorWhite}></EditIcon>
                                            </Fab>


                                            <Fab id="delete-project-button" size="small" aria-label="Delete" className={classes.fab} onClick={() => handleClickOpen(row.id, row.email)}>
                                                <DeleteIcon className={classes.colorWhite} />
                                            </Fab>

                                            <Dialog
                                                open={open}
                                                onClose={handleClose}
                                                aria-labelledby="alert-dialog-title"
                                                aria-describedby="alert-dialog-description">
                                                <DialogTitle id="alert-dialog-title">{`Are you sure you want to delete user: ${deleteName}?`}</DialogTitle>

                                                <DialogActions>
                                                    <Button id="dialog-project-delete-cancel" onClick={handleClose} color="primary">CANCEL</Button>
                                                    <Button id="dialog-project-delete-submit" onClick={() => deleteUser(deleteId)} color="primary" autoFocus>OK</Button>
                                                </DialogActions>
                                            </Dialog>
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
        </ThemeProvider>
    );
}