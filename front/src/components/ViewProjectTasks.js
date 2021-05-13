import { ProjectContext } from "../context/ProjectContext";
import { Button, Card, CardContent, CardActions, LinearProgress, Typography } from '@material-ui/core';
import React, { useState, useEffect, useContext } from 'react'
import { Link, useHistory } from "react-router-dom";
import ProjectService from "../services/ProjectService";
import swal from 'sweetalert';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core/styles';




const theme = createMuiTheme({

    palette: {
        primary: {
            main: '#7eb8da',

        },
        secondary: {
            light: '#92ddea',
            main: '#be9ddf',
            backgroundColor: '#fff',
        },
        default: {
            main: '#be9ddf',
            backgroundColor: '#fff',
        }
    },
});

const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: 500,
        maxWidth: 800,
        '& > * + *': {
            marginTop: theme.spacing(3),
        },
    },
    colorWhite: {
        color: 'white',
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 20,
    },
    pos: {
        marginBottom: 12,
    },
    content: {
        wordWrap: 'break-word',
    }
}));

const ViewProjectTasks = ({ match }) => {
    const { activeProject } = useContext(ProjectContext);
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;
    let history = useHistory();
    const [id, setId] = useState(match.params.id);
    const [personName, setPersonName] = useState([]);


    useEffect(() => {
        id && (ProjectService.getProjectById(id).then((res) => {
            let project = res.data;
            let users = [];
            project.users.forEach((user) => {
                users.push(user.firstName + ` ` + user.lastName);

            })
            setPersonName(users);
        })
            .catch((error) => {
                getErrorMessage();
                history.push('/projects');
            }))
    }, [id]);

    const getErrorMessage = () => {
        const errorMessage = swal({
            text: "Something went wrong! ",
            button: "Go back to project list",
            icon: "warning",
            dangerMode: true,
        });
        return errorMessage;
    }


    return (
        <ThemeProvider theme={theme}>
            <Card className={classes.root}>
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        {activeProject.name}
                    </Typography>
                    <Typography className={classes.content} variant="h5" component="h2">
                        {activeProject.description}
                    </Typography>
                    {<br />}
                    <Typography className={classes.pos} color="textSecondary">
                        <span style={{ fontSize: 24, color: activeProject.status === 'ACTIVE' ? '#cf932b' : '#63cf7f' }}>{activeProject.status}</span>
                    </Typography>
                    {<hr />}

                    <Typography color="textSecondary" variant="caption">TASKS PROGRESS</Typography>
                    <Typography color="textPrimary" variant="h5">{activeProject.taskCount && (Math.round(100 - activeProject.undoneTaskCount / activeProject.taskCount * 100))}%</Typography>
                    <LinearProgress style={{ height: '5px', color: 'black' }}
                        value={activeProject.taskCount ? (100 - activeProject.undoneTaskCount / activeProject.taskCount * 100) : 0} variant="determinate" /><br /><br />

                    <Typography><span>Working on the Project:</span><br /><br /></Typography>

                    {personName.map((fullname, index) => <Typography style={{ fontSize: 16, color: '#9579d1' }} variant="body2" component="p" key={index}>{fullname}</Typography>)}
                </CardContent>
                {/* <CardActions>
                    <Button size="small">Learn More</Button>
                </CardActions> */}
            </Card>
        </ThemeProvider>
    )
}

export default ViewProjectTasks