import React, { useState, useEffect, useContext } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import _ from "lodash";
import { Link } from "react-router-dom";
import TaskService from "../../services/TaskService.js"
import ViewTask from "../dashboard/ViewTask"
import swal from 'sweetalert';
import { useHistory } from 'react-router';
import ProjectService from "../../services/ProjectService";
import { makeStyles } from '@material-ui/core/styles';
import SortIcon from '@material-ui/icons/Sort';
import FilterListIcon from '@material-ui/icons/FilterList';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import { Button, DialogTitle, DialogActions, Dialog, Box, Card, CardContent, Grid, LinearProgress, Typography } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { ProjectContext } from "../../context/ProjectContext";


const useStyles = makeStyles({
    purple: {
        backgroundColor: 'purple',
        width: '25px',
        height: '25px',
        fontSize: '12px',
        marginRight: '2px'
    },
    content:{
        wordWrap: 'break-word',
    }
}

);

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

const BacklogTasks = ({ match }) => {

    const { activeProject, setLocation, refreshBacklog, setRefreshBacklog } = useContext(ProjectContext);

    const classes = useStyles();
    const [activeTasks, setActiveTasks] = useState([]);
    const [backlogTasks, setBacklogTasks] = useState([]);
    const [totalTasksCount, setTotalTasks] = useState(0);
    const [unfinishedTasksCount, setUnfinishedTasks] = useState(0);
    const history = useHistory();
    const [initials, setInitials] = useState([]);
    let randomColor = Math.floor(Math.random() * 16777215).toString(16);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const [state, setState] = useState({
        "ACTIVE": {
            title: "Active",
            items: []
        },
        "BACKLOG": {
            title: "Backlog",
            items: []
        }
    })

    // GET ACTIVE AND BACKLOG TASKS from database 

    useEffect(() => {
        setLocation('backlog');
        let isMounted = true;

        const fetchDataActive = async () => {
            await TaskService.getActiveTasks(activeProject).then(
                response => {
                    if (isMounted) {
                        setActiveTasks(response.data);
                        mapActive(response.data);
                    }
                })
                .catch((error) => {
                    getErrorMessage();
                    history.push('/projects');
                }
                );
        };

        const fetchDataBacklog = async () => {
            await TaskService.getBacklogTasks(activeProject).then(
                response => {
                    if (isMounted) {
                        setBacklogTasks(response.data);
                        mapBacklog(response.data);
                        getUsers();
                    }
                })
                .catch((error) => {
                    getErrorMessage();
                    history.push('/projects');
                }
                );
        };

        fetchDataActive();
        fetchDataBacklog();
        return () => { isMounted = false };
    }, [activeProject, refreshBacklog]);

    // MAP TASKS by status 

    const mapActive = (activeTasks) => {
        setState(state => {
            state = { ...state }
            state.ACTIVE.items = [];
            return state
        })

        for (let i = 0; i < activeTasks.length; i++) {
            activeTasks[i].id = String(activeTasks[i].id);
            if (activeTasks[i].status === "TODO" || activeTasks[i].status === "IN_PROGRESS") {
                setState(state => {
                    state = { ...state }
                    state.ACTIVE.items.push(activeTasks[i]);
                    return state
                })
            }
        }
    }

    const mapBacklog = (backlogTasks) => {
        setState(state => {
            state = { ...state }
            state.BACKLOG.items = [];
            return state
        })

        for (let i = 0; i < backlogTasks.length; i++) {
            backlogTasks[i].id = String(backlogTasks[i].id);
            if (backlogTasks[i].status === "BACKLOG") {
                setState(state => {
                    state = { ...state }
                    state.BACKLOG.items.push(backlogTasks[i]);
                    return state
                })
            }
        }

        // SORT TASKS by updated date
        setState(state => {
            state = { ...state }
            state.ACTIVE.items.sort((a, b) => {
                return new Date(b.updated) - new Date(a.updated)
            });

            state.BACKLOG.items.sort((a, b) => {
                return new Date(b.updated) - new Date(a.updated)
            });
            return state
        })
    }


    // DRAG AND DROP logic
    const handleDragEnd = ({ destination, source, draggableId }) => {
        if (!destination) {
            return
        }
        if (destination.index === source.index && destination.droppableId === source.droppableId) {
            return
        }
        const itemCopy = { ...state[source.droppableId].items[source.index] }
        setState(prev => {
            prev = { ...prev }
            prev[source.droppableId].items.splice(source.index, 1)
            prev[destination.droppableId].items.splice(destination.index, 0, itemCopy)
            return prev
        })
        updateTask(draggableId, destination.droppableId)
    }

    // SEND REQUEST to database to update task status    
    const updateTask = (taskId, newStatus) => {
        let totalTasks = activeTasks.concat(backlogTasks)

        let taskToUpdate = totalTasks.find(item => item.id === taskId);
        if (newStatus === 'BACKLOG') {
            taskToUpdate.status = newStatus;
        }
        else {
            taskToUpdate.status = 'TODO';
        }

        TaskService.updateTask(taskToUpdate, taskId).then(res => {
        })
            .catch((error) => {
                getErrorMessage();
                history.push('/projects');
            }
            );
    }

    const getErrorMessage = () => {
        const errorMessage = swal({
            text: "Something went wrong! ",
            button: "Go back to projects",
            icon: "warning",
            dangerMode: true,
        });
        return errorMessage;
    }

    // GET USERS LIST from database and set initials    
    const getUsers = () => {
        ProjectService.getProjectById(activeProject).then((res) => {
            setInitials(initials => {
                initials = [...initials]
                initials = [];
                return initials;
            })
            let project = res.data;

            project.users.map((user) => {
                let userInitials = user.firstName.charAt(0).trim() + user.lastName.charAt(0).trim();
                setInitials(initials => {
                    initials = [...initials]
                    initials.push(userInitials);
                    return initials;
                })
            })

            setTitle(project.name);
            setContent(project.description);
            setTotalTasks(project.tasks.length)
            setUnfinishedTasks(project.tasks.filter((item) => item.status !== "DONE").length);
        })
            .catch((error) => {
                getErrorMessage();
                history.push('/projects');
            });
    }

    // DELETE TASK
    const [open, setOpen] = React.useState(false);
    const [deleteId, setDeleteId] = React.useState(0);
    const [deleteName, setDeleteName] = React.useState(0);

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickOpen = (rowId, rowName) => {
        setOpen(true);
        setDeleteId(rowId);
        setDeleteName(rowName);
    };

    const deleteTask = async (taskId) => {
        await TaskService.deleteTask(taskId).then(res => {
            getSuccessMessage("deleted");
            setRefreshBacklog(!refreshBacklog);
        })
            .catch((error) => {
                getErrorMessage();
            }
            );
        handleClose();
        setTotalTasks(totalTasksCount - 1);
        setUnfinishedTasks(unfinishedTasksCount - 1);
    }

    const getSuccessMessage = (status) => {
        const successMessage = swal({
            title: "Request successful",
            text: `The task has been ${status}`,
            icon: "success",
            // button: "Go back to project list",
        });
        return successMessage;
    }

    return (
        <div className="activeBoard">
            <div style={{ fontSize: 'larger', fontWeight: 'bold', marginLeft: '20px' }}>
                {title}
            </div>

            <div className="container-fluid containerDashboard">
                <div className="row">
                    <div className="col col-7">
                        <Card style={{ height: '100%' }} >
                            <CardContent>
                                        <Typography className={classes.content} color="textPrimary" variant="body2">{content}</Typography>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="col col-2">
                        <Card style={{ height: '100%' }} >
                            <CardContent>
                                <Grid container style={{ justifyContent: 'space-between' }}>
                                    <Grid item><Typography color="textSecondary" variant="caption">TOTAL TASKS</Typography>
                                        <Typography color="textPrimary" variant="h5">{totalTasksCount}</Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="col col-3">  <Card style={{ height: '100%' }} >
                        <CardContent>
                            <Grid container style={{ justifyContent: 'space-between' }}>
                                <Grid item><Typography color="textSecondary" variant="caption">TASKS PROGRESS</Typography>
                                    <Typography color="textPrimary" variant="h5">{Math.round(100 - unfinishedTasksCount / totalTasksCount * 100)}%</Typography>
                                    <Box >
                                        <LinearProgress style={{ height: '5px', color: 'black' }}
                                            value={100 - unfinishedTasksCount / totalTasksCount * 100} variant="determinate" />
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    </div>
                </div>
            </div>
            <div className="headingStyleBacklog2">
                <div style={{ display: 'flex', justifyContent: 'right' }}><AddIcon /><ViewTask task={{}} status='BACKLOG' projectId={activeProject} add={true} /><SortIcon ></SortIcon>Sort
                <FilterListIcon></FilterListIcon>Filter<SearchIcon></SearchIcon>Search  </div>
                <div> <Link to={`/active-board/${match.params.id}`}>
                    <button className="btn" style={{ backgroundColor: '#be9ddf', color: 'white' }}>Go to active board</button>
                </Link> </div>
            </div>
            <div className={"dndContainerBacklog"}>
                <DragDropContext onDragEnd={handleDragEnd}>
                    {_.map(state, (data, key) => {
                        return (
                            <div key={key} className={"column"}>
                                <div>
                                    <div><h6>{data.title}</h6>
                                    </div>
                                    <Droppable droppableId={key}>
                                        {(provided, snapshot) => {
                                            return (
                                                <div ref={provided.innerRef}{...provided.droppableProps} className={"droppable-col-Backlog"}>
                                                    {data.items.map((el, index) => {
                                                        return (
                                                            <Draggable key={el.id} index={index} draggableId={el.id}>
                                                                {(provided, snapshot) => {
                                                                    return (
                                                                        <div
                                                                            className={`itemBacklog ${snapshot.isDragging && "dragging"} ${el.priority === "MEDIUM" ? "medium" : (el.priority === "LOW" ? "low" : "high")}`}
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                        >
                                                                            <div className="boardTaskBacklog">
                                                                                <div>
                                                                                    <ViewTask task={el} status='BACKLOG' projectId={activeProject} add={false} />
                                                                                </div>
                                                                                <div>

                                                                                    <DeleteIcon id="icon" onClick={() => handleClickOpen(el.id, el.name)} style={{ fontSize: 'large', color: 'grey', cursor: 'pointer' }} />
                                                                                    {/* </Fab> */}

                                                                                    <Dialog
                                                                                        open={open}
                                                                                        onClose={handleClose}
                                                                                        aria-labelledby="alert-dialog-title"
                                                                                        aria-describedby="alert-dialog-description">
                                                                                        <DialogTitle id="alert-dialog-title">{`Are you sure you want to delete project: ${deleteName}?`}</DialogTitle>

                                                                                        <DialogActions>
                                                                                            <Button onClick={handleClose} color="primary">CANCEL</Button>
                                                                                            <Button onClick={() => deleteTask(deleteId)} color="primary" autoFocus>OK</Button>
                                                                                        </DialogActions>
                                                                                    </Dialog>
                                                                                </div>
                                                                            </div>


                                                                        </div>
                                                                    )
                                                                }}
                                                            </Draggable>
                                                        )
                                                    })}
                                                    {provided.placeholder}
                                                </div>
                                            )
                                        }}
                                    </Droppable>
                                </div>

                            </div>
                        )
                    })}
                </DragDropContext>
            </div>

        </div>
    )
}

export default BacklogTasks