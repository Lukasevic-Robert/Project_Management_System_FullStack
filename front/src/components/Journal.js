import React, { useContext, useState, useEffect } from 'react';
import '../Projects.css'
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Button } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { ProjectContext } from '../context/ProjectContext.js';
import JournalService from '../services/JournalService';
import SaveIcon from '@material-ui/icons/Save';


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
    button: {
        margin: theme.spacing(1),
        color: 'white',
        marginLeft: 'auto'
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

    const { rowsPerPageJournal, setRowsPerPageJournal, pageJournal, setPageJournal, refreshJournal } = useContext(ProjectContext);
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

            }
        );
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
            <Paper className="table-container">
                <TableContainer >
                    <div style={{ display: 'flex' }}>  <Button id="journal-csv" onClick={getJournalCSV} variant="contained" color="primary" size="small" className={classes.button} startIcon={<SaveIcon />}>Save All .csv</Button></div>
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

                                    <TableRow key={row.entryID} style={row.type === 'ERROR' ? { backgroundColor: '#ffebee' } : { backgroundColor: '#e8f5e9' }} className={classes.tableRow}>

                                        <TableCell className={classes.projectName}><span>{row.entryID}</span></TableCell>

                                        <TableCell className={classes.description} align="center"><span>{row.email}</span></TableCell>

                                        <TableCell align="center">{row.time.replace("T", " ").substr(0, 19)}</TableCell>

                                        <TableCell align="center" style={row.type === 'ERROR' ? { color: '#f44336' } : { color: '#4caf50' }}>{row.type}</TableCell>

                                        <TableCell align="center">{row.category}</TableCell>
                                        <TableCell align="center" style={row.type === 'ERROR' ? { color: '#f44336' } : { color: '#4caf50' }}>{row.activity}</TableCell>
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