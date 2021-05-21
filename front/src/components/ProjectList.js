import React, { useContext, useState, useEffect } from 'react';
import '../Projects.css'
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button, DialogTitle, DialogActions, Dialog, Fab } from '@material-ui/core';
import ProjectService from "../services/ProjectService.js";
import { useHistory } from "react-router-dom";
import swal from 'sweetalert';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import AddIcon from '@material-ui/icons/Add';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { ProjectContext } from '../context/ProjectContext.js';
import { AuthContext } from '../context/AuthContext.js';
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
    const [searchRequest, setSearchRequest] = useState('');
    const [searchSubmit, setSearchSubmit] = useState(false);
    const [iconSwitcher, setIconSwitcher] = useState(false);



    // GET PROJECTS from database ==========================>
    useEffect(() => {
        if (searchSubmit) {
            if (searchRequest === '') {
                getProjectByKeyword('');
            } else {
                getProjectByKeyword();
            }
        } else if (searchRequest !== '') {
            getProjectByKeyword();
        } else if (!filtered) {
            getProjects();
        } else {
            getProjectsByUser();
        }
        setActiveProjectId('');
        checkAuthorization();
        setSearchSubmit(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, rowsPerPage, refreshProject, filtered])

    useEffect(() => {
        setIconSwitcher(false);
    }, [searchRequest])

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
        setPage(0);
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
    const deleteProject = (id) => {
        ProjectService.deleteProject(id).then(res => {
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

    const changeFiltered = () => {
        setPage(0);
        setFiltered(!filtered);
    }

    const getProjectCSV = () => {
        ProjectService.requestProjectCSV();
    }

    const handleSearch = (event) => {
        if (event.target.value === '') {
            setRefreshProject(!refreshProject);
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
            setRefreshProject(!refreshProject);
        }
    }
    const getProjectByKeyword = async (empty) => {
        await ProjectService.getProjectByKeyword(empty === '' ? '' : searchRequest, empty === '' ? 0 : page, rowsPerPage).then((response) => {
            console.log('getProjectByKeyword ' + searchSubmit);

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
            })
    }

    const handleClear = () => {
        setSearchRequest('');
        setRefreshProject(!refreshProject);
    }

    return (

        <ThemeProvider theme={theme}>
            <Paper className="table-container">
                <TableContainer >
                    <div className="projectHeadingStyle">
                        {projectBoss && (
                            <Button id="project-create-button" onClick={() => history.push(`/projects/-1`)} size="medium" variant="contained" color="primary" className={classes.createButton}>
                                <AddIcon style={{ marginLeft: -10 }} className={classes.colorWhite} id="add-project-button" /> Add New Project
                            </Button>)}
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
                                ? (<IconButton onClick={handleClear} className={classes.iconButton} color="primary">
                                    <ClearRoundedIcon />
                                </IconButton>)
                                : (<IconButton type="submit" className={classes.iconButton} color="primary" aria-label="search">
                                    <SearchIcon />
                                </IconButton>)}

                        </Paper>
                        <Button id="filter-project-by-user" onClick={changeFiltered} className={classes.filterProjects} variant="outlined"><span style={{ fontFamily: 'M PLUS 1p', fontSize: 15 }}>{!filtered ? <>Only My Projects</> : <>Show All Projects</>}</span></Button>
                        <Button id="project-csv" onClick={getProjectCSV} variant="contained" color="primary" size="small" className={classes.button} startIcon={<SaveIcon />}>Save all .csv</Button>
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
                                    <TableCell id="table-cell" align="right" style={{paddingRight:35}}>ACTIONS</TableCell>)}
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


                                                <Fab id="delete-project-button" size="small" aria-label="Delete" className={classes.fab} onClick={() => handleClickOpen(row.id, row.name)}>
                                                    <DeleteIcon className={classes.colorWhite} />
                                                </Fab>

                                                <Dialog
                                                    open={open}
                                                    onClose={handleClose}
                                                    aria-labelledby="alert-dialog-title"
                                                    aria-describedby="alert-dialog-description">
                                                    <DialogTitle id="alert-dialog-title">{`Are you sure you want to delete project: ${deleteName}?`}</DialogTitle>

                                                    <DialogActions>
                                                        <Button id="dialog-project-delete-cancel" onClick={handleClose} color="primary">CANCEL</Button>
                                                        <Button id="dialog-project-delete-submit" onClick={() => deleteProject(deleteId)} color="primary" autoFocus>OK</Button>
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