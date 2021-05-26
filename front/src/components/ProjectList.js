import React, { useContext, useState, useEffect } from 'react';
import '../Projects.css'
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button, Fab } from '@material-ui/core';
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
            main: '#f6c1c7',
        },
    },
    overrides: {
        MuiTablePagination: {

            root: {
                color: 'white',
                backgroundColor: 'transparent'
            },
            selectIcon: {
                color: 'white',
            },
        },
        MuiPaper: {
            root: {
                backgroundColor: '#4d81d8',
                color: 'white'
            }

        },
        MuiButton: {
            contained: {
                backgroundColor: '#d44a28',
                // boxShadow: 'none',
                '&:hover': {
                    backgroundColor: 'transparent',
                },
            }

        },
        MuiFab: {
            root: {
                '&:hover': {
                    backgroundColor: 'transparent',
                    boxShadow: '1px 1px 5px black'
                },
            }
        },
    }
});



const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    fab: {
        margin: 5,
        backgroundColor: 'transparent',
        boxShadow: 'none'

    },
    createButton: {
        textTransform: 'none',
        color: 'white',
    },
    tableRow: {
        height: 60,
    },
    colorWhite: {
        color: 'white',
    },
    filterProjects: {
        marginLeft: 10,
        height: 40,
        textTransform: 'none',
     backgroundColor: '#ffc814',
        border: 'none',
        color: 'white',
      
    },
    description: {
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        maxWidth: '150px',
        color: 'white',
    },
    projectName: {
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        maxWidth: '150px',
        color: 'white',
    },

    button: {
        margin: theme.spacing(1),
        color: 'white',
        marginLeft: 'auto',
        backgroundColor: '#ffc814'
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
        backgroundColor: 'transparent',
    },
    input: {
        color: 'white',
        marginLeft: theme.spacing(1),
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'Fira Sans',
    },
    iconButton: {
        padding: 10,
        '&:hover': {
            color: '#be9ddf',
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

    const deleteFunction = (id, projectName) => {
        swal({
            text: `Are you sure you want to delete project: ${projectName}?`,
            // text: "You won't be able to revert this!",
            icon: 'warning',
            className: "swalFont",
            buttons: ["Cancel", "Yes, delete it!"],
            // buttons: true,
            dangerMode: true,
        }).then(async (isConfirm) => {
            if (isConfirm) {
                await ProjectService.deleteProject(id).then(res => {
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
        await ProjectService.getProjectByKeyword(empty === '' ? '' : searchRequest.trim(), empty === '' ? 0 : page, rowsPerPage).then((response) => {
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
            <Paper style={{ backgroundColor: value.state.checkedA ? 'rgba(13, 17, 31, 0.514)' : 'transparent', border: 'none', boxShadow: 'none', marginTop: '-70px'}} className="table-container">
                <TableContainer  >
                    <div className="projectHeadingStyle">
                        {projectBoss && (
                            <Button id="project-create-button" onClick={() => history.push(`/projects/-1`)} size="medium" variant="contained" className={classes.createButton}>
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
                                ? (<IconButton onClick={handleClear} className={classes.iconButton} style={{ color: 'white'}}>
                                    <ClearRoundedIcon />
                                </IconButton>)
                                : (<IconButton type="submit" className={classes.iconButton} style={{ color: 'white'}} aria-label="search">
                                    <SearchIcon />
                                </IconButton>)}

                        </Paper>
                        <Button id="filter-project-by-user" onClick={changeFiltered} className={classes.filterProjects} variant="contained"><span style={{ fontFamily: 'M PLUS 1p', fontSize: 15 }}>{!filtered ? <>Only My Projects</> : <>Show All Projects</>}</span></Button>
                        <Button id="project-csv" onClick={getProjectCSV} variant="contained" size="small" className={classes.button} startIcon={<SaveIcon />}>Save all .csv</Button>
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
                                    <TableCell id="table-cell" align="right" style={{ paddingRight: 35 }}>ACTIONS</TableCell>)}
                            </TableRow>
                        </TableHead>
                        <TableBody className="table-body">
                            {
                                (projects).map((row) => (
                                    <TableRow key={row.id} className={classes.tableRow}>
                                        <TableCell className={classes.projectName} onClick={() => handleRedirect(row)} style={{ cursor: 'pointer' }}><span>{row.name}</span></TableCell>
                                        <TableCell className={classes.description} align="center">{row.description}</TableCell>
                                        <TableCell align="center"><span style={{ color: row.status === 'ACTIVE' ? '#ff9b8a' : '#ccffbf' }}>{row.status}</span></TableCell>
                                        <TableCell style={{ color: 'white' }} align="center">{row.taskCount}</TableCell>
                                        <TableCell style={{ color: 'white' }} align="center">{row.undoneTaskCount}</TableCell>
                                        {projectBoss && (
                                            <TableCell align="right">

                                                <Fab id="link-to-edit-projects1" size="small" onClick={() => history.push(`/projects/${row.id}`)} aria-label="Edit" className={classes.fab}>
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