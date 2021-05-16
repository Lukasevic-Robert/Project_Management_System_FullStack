import React, { useContext, useState, useEffect } from 'react';
import '../Projects.css'
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button, DialogTitle, DialogActions, Dialog, Fab } from '@material-ui/core';
import { useHistory } from "react-router-dom";

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { ProjectContext } from '../context/ProjectContext.js';
import { AuthContext } from '../context/AuthContext.js';
import JournalService from '../services/JournalService';


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

function Journal() {

    let history = useHistory();
    const { rowsPerPage, setRowsPerPage, page, setPage, setActiveProjectId, setProjectName, setActiveProject, refreshProject, setRefreshProject } = useContext(ProjectContext);
    const value = useContext(AuthContext);
    const [projectBoss, setProjectBoss] = useState(false);
    const classes = useStyles();
    const [entries, setEntries] = useState([]);
    const [responseData, setResponseData] = useState([]);
    const [elementCount, setElementCount] = useState(1);
    const [errorsFromBack, setErrorsFromBack] = useState([]);



    // GET PROJECTS from database ==========================>
    useEffect(() => {
        getEntries();
    }, [page, rowsPerPage, refreshProject])

    const getEntries = async () => {

        await JournalService.getEntries(page, rowsPerPage).then(
            response => {
                setResponseData(response.data);
                setEntries(response.data.content);
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
   

    // PAGINATION =========================================>
    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(event.target.value);
        setPage(0);
    };
    
    return (

        <ThemeProvider theme={theme}>
            <Paper className="table-container">
                <TableContainer >
                   
                    <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow id="table-head" >
                                <TableCell id="table-cell" >ID</TableCell>
                                <TableCell id="table-cell" align="center">EMAIL</TableCell>
                                <TableCell id="table-cell" align="center">TIME</TableCell>
                                <TableCell id="table-cell" align="center">TYPE</TableCell>
                                <TableCell id="table-cell" align="center">CATEGORY</TableCell>
                                    <TableCell id="table-cell" align="center">ACTIVITY</TableCell>
                                    <TableCell id="table-cell" align="center">MESSAGE</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                (entries).map((row) => (

                                    <TableRow key={row.entryID} className={classes.tableRow}>

                                        <TableCell className={classes.projectName}><span>{row.entryID}</span></TableCell>

                                        <TableCell className={classes.description} align="center">{row.email}</TableCell>
                                        
                                        <TableCell align="center">{row.time.replace("T", " ").substr(0, 19)}</TableCell>
                                        
                                        <TableCell align="center">{row.type}</TableCell>

                                        <TableCell align="center">{row.category}</TableCell>
                                        <TableCell align="center">{row.activity}</TableCell> 
                                        <TableCell align="center">{row.message}</TableCell>

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

export default Journal;