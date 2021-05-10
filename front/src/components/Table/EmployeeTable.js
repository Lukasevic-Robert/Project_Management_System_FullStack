import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import UserService from "../../services/UserService.js"
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';



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


export default function EmployeeTable() {
    const classes = useStyles();
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(0);

    const [data, setData] = useState([]);
    const [elementCount, setElementCount] = useState(1);

    useEffect(() => {

        UserService.getUsers().then((res) => {
            let users = res.data;
            setData(users);
            setElementCount(users.length);
        })
            .catch((error) => {
                this.getErrorMessage();
                this.props.history.push('/projects');

            });
    }, [])

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
                                <TableCell id="table-cell" >CHECK</TableCell>
                                <TableCell id="table-cell" >ID</TableCell>
                                <TableCell id="table-cell" >NAME</TableCell>
                                <TableCell id="table-cell" >EMAIL</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                (data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)).map((row) => (
                                    <TableRow key={row.id} className={classes.tableRow}>
                                        <TableCell><FormControlLabel control={<Checkbox color="primary"/>}label="Primary"/></TableCell>
                                        <TableCell >{row.id}</TableCell>
                                        <TableCell >{row.firstName + ` ` + row.lastName}</TableCell>
                                        <TableCell >{row.email}</TableCell>
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