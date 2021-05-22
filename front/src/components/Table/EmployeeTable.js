import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import UserService from "../../services/UserService.js";
import '../../Projects.css'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button, Fab } from '@material-ui/core';
import { useHistory } from "react-router-dom";
import swal from 'sweetalert';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import AddIcon from '@material-ui/icons/Add';
import { UserContext } from '../../context/UserContext.js';
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
    const [responseData, setResponseData] = useState([]);

    const [errorsFromBack, setErrorsFromBack] = useState([]);
    const [searchRequest, setSearchRequest] = useState('');
    const [searchSubmit, setSearchSubmit] = useState(false);
    const [iconSwitcher, setIconSwitcher] = useState(false);


    useEffect(() => {
        if (searchSubmit) {
            if (searchRequest === '') {
                getUsers();
            } else {
                getUserByKeyword();
            }
        } else if (searchRequest !== '') {
            getUserByKeyword();
        } else {
            getUsers();
        }
        setSearchSubmit(false);

    }, [page, rowsPerPage, refreshUsers]);

    useEffect(() => {
        setIconSwitcher(false);
    }, [searchRequest])


    const getUsers = () => {
        UserService.getUserPage(page, rowsPerPage).then((res) => {
            let users = res.data.content;
            setData(users);
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

    const getUserCSV = () => {
        UserService.requestUserCSV();
    }

    const handleSearch = (event) => {
        if (event.target.value === '') {
            setRefreshUsers(!refreshUsers);
        }
        setSearchRequest(event.target.value);
    }
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (searchRequest === '') {
            setIconSwitcher(false);
        } else {
            setIconSwitcher(true);
        }
        setSearchSubmit(true);
        if (page > 0) {
            setPage(0);
        } else {
            setRefreshUsers(!refreshUsers);
        }
    }

    const getUserByKeyword = async (empty) => {
        await UserService.getUserByKeyword(empty === '' ? '' : searchRequest, empty === '' ? 0 : page, rowsPerPage).then((response) => {

            setResponseData(response.data);
            setData(response.data.content);
            setElementCount(response.data.totalElements);
        },
            error => {
                setErrorsFromBack((error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                    error.message ||
                    error.toString())
            })
    }

    const handleClear = () => {
        setSearchRequest('');
        setRefreshUsers(!refreshUsers);
    }

    const deleteFunction = (id, userName) => {
        swal({
            text: `Are you sure you want to delete user: ${userName}?`,
            // text: "You won't be able to revert this!",
            icon: 'warning',
            className: "swalFont",
            buttons: ["Cancel", "Yes, delete it!"],
            // buttons: true,
            dangerMode: true,
        }).then(async (isConfirm) => {
            if (isConfirm) {
                await UserService.deleteUser(id).then(res => {
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
            }
        })
    }




    return (
        <ThemeProvider theme={theme}>
            <Paper className="table-container">
                <TableContainer >
                    <div className="projectHeadingStyle">

                        <Button id="user-create-button" onClick={() => history.push(`/admin/create-user/-1`)} size="medium" variant="contained" color="primary" className={classes.createButton}>
                            <AddIcon style={{ marginLeft: -10 }} className={classes.colorWhite} id="add-user-button" /> Add New User
                            </Button>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <Paper id="search-bar" component="form" onSubmit={handleSearchSubmit} className={classes.search}>
                            <InputBase id="search-input"
                                className={classes.input}
                                placeholder="Search..."
                                inputProps={{ 'aria-label': 'search google maps' }}
                                onChange={handleSearch}
                                value={searchRequest}
                            />
                            {iconSwitcher
                                ? (<IconButton id="clear-user-search" onClick={handleClear} className={classes.iconButton} color="primary">
                                    <ClearRoundedIcon />
                                </IconButton>)
                                : (<IconButton id="user-search" type="submit" className={classes.iconButton} color="primary" aria-label="search">
                                    <SearchIcon />
                                </IconButton>)}

                        </Paper>

                        <Button id="user-csv" onClick={getUserCSV} variant="contained" color="primary" size="small" className={classes.button} startIcon={<SaveIcon />}>Save all .csv</Button>
                    </div>
                    <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow id="table-head" >
                                <TableCell id="table-cell" >ID</TableCell>
                                <TableCell id="table-cell" align="center">NAME</TableCell>
                                <TableCell id="table-cell" align="center">E-MAIL</TableCell>
                                <TableCell id="table-cell" align="center">STATUS</TableCell>
                                <TableCell id="table-cell" align="center">ROLE</TableCell>
                                <TableCell id="table-cell" align="right" style={{ paddingRight: 35 }}>ACTIONS</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                (data).map((row) => (
                                    <TableRow key={row.id} style={row.status === 'INACTIVE' ? { backgroundColor: '#ffebee' } : row.status === 'PENDING' ? { backgroundColor: '#fcf2e6' } : { backgroundColor: '' }} className={classes.tableRow}>
                                        <TableCell ><span>{row.id}</span></TableCell>
                                        <TableCell align="center">{row.firstName + ` ` + row.lastName}</TableCell>
                                        <TableCell align="center">{row.email}</TableCell>
                                        <TableCell align="center"><span style={{ color: row.status === 'ACTIVE' ? '#63cf7f' : row.status === 'PENDING' ? '#cf932b' : '#e03b24' }}>{row.status}</span></TableCell>
                                        <TableCell align="center" style={{ color: row.roles[0].name.split('_')[1] === 'ADMIN' ? '#9545d8' : row.roles[0].name.split('_')[1] === 'MODERATOR' ? '#2e6fd9' : '' }}><span>{row.roles[0].name.split('_')[1]}</span></TableCell>
                                        <TableCell align="right">

                                            <Fab id="link-to-edit-users1" size="small" color="secondary" onClick={() => history.push(`/admin/create-user/${row.id}`)} aria-label="Edit" className={classes.fab}>
                                                <EditIcon className={classes.colorWhite}></EditIcon>
                                            </Fab>
                                            <Fab id="delete-user-button" size="small" aria-label="Delete" className={classes.fab} onClick={() => deleteFunction(row.id, row.email)}>
                                                <DeleteIcon className={classes.colorWhite} />
                                            </Fab>
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