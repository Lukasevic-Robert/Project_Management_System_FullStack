import React, { useContext, useState, useEffect } from 'react';
import '../Projects.css'
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { ProjectContext } from '../context/ProjectContext.js';
import JournalService from '../services/JournalService';
import SaveIcon from '@material-ui/icons/Save';
import { AuthContext } from '../context/AuthContext.js';
import swal from 'sweetalert';



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
                // boxShadow: 'none',
                backgroundColor: '#d44a28',
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
        fontFamily: 'Fira Sans'
    },
    iconButton: {
        padding: 10,
        '&:hover': {
            color: '#9c6ccc',
        }
    },
});

function Journal() {

    
    const { rowsPerPageJournal, setRowsPerPageJournal, pageJournal, setPageJournal, refreshJournal } = useContext(ProjectContext);
    const {state} = useContext(AuthContext);
    const classes = useStyles();
    const [entries, setEntries] = useState([]);
    // const [responseData, setResponseData] = useState([]);
    const [elementCount, setElementCount] = useState(1);

    // GET EVENTS from database ==========================>
    useEffect(() => {
        getEntries();
    }, [pageJournal, rowsPerPageJournal, refreshJournal])

    const getEntries = async () => {

        await JournalService.getEntries(pageJournal, rowsPerPageJournal).then(
            response => {
                // setResponseData(response.data);
                setEntries(response.data.content);
                setElementCount(response.data.totalElements);
                // setUsersId(response.data.content.users.id);
            },
            error => {

                getErrorMessage();
            }
        );
    }
   
    const getErrorMessage = () => {
        const errorMessage = swal({
            text: "Something went wrong! ",
            button: "Ok",
            icon: "warning",
            dangerMode: true,
        });
        return errorMessage;
    }

    // PAGINATION =========================================>
    const handleChangePage = (event, newPage) => {
        setPageJournal(newPage)
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPageJournal(event.target.value);
        setPageJournal(0);
    };

    const getJournalCSV = () => {
        JournalService.requestJournalCSV();
    }

    return (

        <ThemeProvider theme={theme}>
            <Paper style={{ backgroundColor: state.checkedA ? 'rgba(13, 17, 31, 0.514)' : 'transparent', border: 'none', boxShadow: 'none', marginTop: '-70px' }} className="table-container">
                <TableContainer >
                    <div style={{ display: 'flex' }}>  <Button id="journal-csv" onClick={getJournalCSV} variant="contained"  size="small" className={classes.button} startIcon={<SaveIcon />}>Save All .csv</Button></div>
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

                                    <TableRow key={row.entryID} style={row.type === 'ERROR' ? {backgroundColor: 'rgba(179, 11, 11, 0.397)'} : {backgroundColor: ''}} className={classes.tableRow}>

                                        <TableCell style={{ color: 'white' }} className={classes.projectName}><span>{row.entryID}</span></TableCell>

                                        <TableCell style={{ color: 'white' }} className={classes.description} align="center"><span>{row.email}</span></TableCell>

                                        <TableCell style={{ color: 'white' }} align="center">{row.time.replace("T", " ").substr(0, 19)}</TableCell>

                                        <TableCell align="center" style={row.type === 'ERROR' ? { color: '#fa9a89' } : { color: '#ccffbf' }}><span>{row.type}</span></TableCell>

                                        <TableCell style={{ color: 'white' }} align="center">{row.category}</TableCell>
                                        <TableCell align="center" style={row.type === 'ERROR' ? { color: '#fa9a89', } : { color: '#ccffbf' }}><span>{row.activity}</span></TableCell>
                                        <TableCell style={{ color: 'white' }} align="center">{row.message}</TableCell>

                                    </TableRow>
                                ))}
                        </TableBody>

                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={elementCount}
                    rowsPerPage={rowsPerPageJournal}
                    page={pageJournal}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
        </ThemeProvider>

    );
}

export default Journal;