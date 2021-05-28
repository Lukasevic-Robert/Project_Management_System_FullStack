import { ProjectContext } from "../context/ProjectContext";
import { Button, Card, CardContent, CardActions, LinearProgress, Typography } from '@material-ui/core';
import React, { useState, useEffect, useContext } from 'react'
import { Link, useHistory } from "react-router-dom";
import ProjectService from "../services/ProjectService";
import swal from 'sweetalert';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core/styles';
import { AuthContext } from '../context/AuthContext.js';




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
        borderRadius: '0',
        borderTop: '1px solid #fff',
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
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('');
    const [content, setContent] = useState('');
    const [totalTasksCount, setTotalTasks] = useState(0);
    const [unfinishedTasksCount, setUnfinishedTasks] = useState(0);
    const {state} = useContext(AuthContext);


    useEffect(() => {
        id && (ProjectService.getProjectById(id).then((res) => {
            let project = res.data;
            let users = [];
            project.users.forEach((user) => {
                users.push(user.firstName + ` ` + user.lastName);

            })
            setPersonName(users);
            setTitle(project.name);
            setContent(project.description);
            setStatus(project.status);
            setTotalTasks(project.tasks.length);
            setUnfinishedTasks(project.tasks.filter((item) => item.status !== "DONE").length);
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
            <Card className={classes.root} style={{background: 'linear-gradient(rgba(13, 17, 31, 0.514), transparent 100%)', backgroundColor: state.checkedA ? 'rgba(13, 17, 31, 0.514)' : 'transparent'}}>
                <CardContent>
                    <Typography className={classes.title} style={{ color: "silver"}} gutterBottom>
                        {title}
                    </Typography>
                    <Typography className={classes.content} style={{ color: "white"}} variant="h5" component="h2">
                        {content}
                    </Typography>
                    {<br />}
                    <Typography className={classes.pos} color="textSecondary">
                        <span style={{ fontSize: 24, color: status === 'ACTIVE' ? '#ff9b8a' : '#63cf7f' }}>{status}</span>
                    </Typography>
                    {<hr color="silver"/>}

                    <Typography style={{ color: "white"}} variant="caption">TASKS PROGRESS</Typography>
                    <Typography style={{ color: "white"}} variant="h5">{totalTasksCount && (Math.round(100 - unfinishedTasksCount / totalTasksCount * 100))}%</Typography>
                    <LinearProgress style={{ height: '5px', color: '#d44a28' }}
                        value={totalTasksCount ? (100 - unfinishedTasksCount / totalTasksCount * 100) : 0} variant="determinate" /><br /><br />

                    <Typography><span style={{ color: "#ffc814"}}>Working on the Project:</span><br /><br /></Typography>

                    {personName.map((fullname, index) => <Typography style={{ fontSize: 16, color: 'white' }} variant="body2" component="p" key={index}>{fullname}</Typography>)}
                </CardContent>
                {/* <CardActions>
                    <Button size="small">Learn More</Button>
                </CardActions> */}
            </Card>
        </ThemeProvider>
    )
}

export default ViewProjectTasks