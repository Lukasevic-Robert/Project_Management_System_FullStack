import React, { useState, useEffect, useContext } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import _ from "lodash";
import TaskService from "../../services/TaskService.js"
import ViewTask from "./ViewTask"
import swal from 'sweetalert';
import { useHistory } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from "@material-ui/core/Tooltip";
import ReplyIcon from '@material-ui/icons/Reply';
import AddIcon from '@material-ui/icons/Add';
import { Typography, Fab, Button } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import { ProjectContext } from '../../context/ProjectContext';
import { AuthContext } from '../../context/AuthContext';
import { ThemeProvider } from '@material-ui/styles';

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
        MuiFab: {
            root: {
                '&:hover': {
                    backgroundColor: 'transparent',
                    boxShadow: '1px 1px 5px black'
                },
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
    },
});
const useStyles = makeStyles({
    purple: {
        backgroundColor: 'purple',
        width: '30px',
        height: '30px',
        fontSize: '12px',
        marginRight: '2px'
    },
    fab: {
        marginLeft: 5,
        marginRight: 5,
        backgroundColor: 'transparent',
        boxShadow: 'none'

    },
    border: {
        borderColor: 'white',
    },
    button: {
        margin: theme.spacing(1),
        color: 'white',
        marginLeft: 'auto',
        backgroundColor: '#ffc814',
        display: 'flex',
      
    },
}
);

const ActiveBoard = ({ match }) => {
    const { projectName, setLocation, refreshActive} = useContext(ProjectContext);
    const value = useContext(AuthContext);
    const activeProjectID = match.params.id;
    const classes = useStyles();
    const [activeTasks, setActiveTasks] = useState([]);
    const history = useHistory();
    const [initials, setInitials] = useState([]);
    const [state, setState] = useState({
        "TODO": {
            title: "To do",
            items: []
        },
        "IN_PROGRESS": {
            title: "In progress",
            items: []
        },
        "DONE": {
            title: "Done",
            items: []
        }
    })

    // GET ACTIVE TASKS from database 

    useEffect(() => {
        setLocation('active');
        let isMounted = true;
        const fetchData = async () => {
            await TaskService.getActiveTasks(activeProjectID).then(
                response => {
                    if (isMounted) {
                        setActiveTasks(response.data);
                        mapByStatus(response.data);
                    }
                })
                .catch((error) => {
                    getErrorMessage(error);
                    history.push('/projects');
                }
                );
        };
        fetchData();
        return () => { isMounted = false };
    }, [activeProjectID, refreshActive]);

    // MAP TASKS by status 

    const mapByStatus = (activeTasks) => {
        setState(state => {
            state = { ...state }
            state.TODO.items = [];
            state.IN_PROGRESS.items = [];
            state.DONE.items = [];
            return state
        })

        for (let i = 0; i < activeTasks.length; i++) {
            activeTasks[i].id = String(activeTasks[i].id);
            if (activeTasks[i].status === "TODO") {
                setState(state => {
                    state = { ...state }
                    state.TODO.items.push(activeTasks[i]);
                    return state
                })
            }
            if (activeTasks[i].status === "IN_PROGRESS") {
                setState(state => {
                    state = { ...state }
                    state.IN_PROGRESS.items.push(activeTasks[i]);
                    return state
                })
            }
            if (activeTasks[i].status === "DONE") {
                setState(state => {
                    state = { ...state }
                    state.DONE.items.push(activeTasks[i]);
                    return state
                })
            }
        }
        // SORT TASKS by updated date
        setState(state => {
            state = { ...state }
            state.TODO.items.sort((a, b) => {
                return new Date(b.updated) - new Date(a.updated)
            });

            state.IN_PROGRESS.items.sort((a, b) => {
                return new Date(b.updated) - new Date(a.updated)
            });

            state.DONE.items.sort((a, b) => {
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
        let taskToUpdate = activeTasks.find(item => item.id === taskId);
        taskToUpdate.status = newStatus;
        TaskService.updateTask(taskToUpdate, taskId).then(res => {
        })
            .catch((error) => {
                getErrorMessage();
            }
            );
    }

    const getErrorMessage = (error) => {
        console.log(error)
        const errorMessage = swal({
            text: `Something went wrong! - ${error}`,
            button: "Go back to projects",
            icon: "warning",
            dangerMode: true,
        });
        return errorMessage;
    }


    // SEND TASK to backlog, update database and board    
    const sendToBacklog = async (task) => {
        task.status = "BACKLOG";
        await TaskService.updateTask(task, task.id).then(res => {
            setState(prev => {
                prev = { ...prev }
                prev.TODO.items = prev.TODO.items.filter((item) => item.id !== task.id);
                prev.IN_PROGRESS.items = prev.IN_PROGRESS.items.filter((item) => item.id !== task.id)
                prev.DONE.items = prev.DONE.items.filter((item) => item.id !== task.id)
                return prev
            })
        })
            .catch((error) => {
                getErrorMessage();
            }
            );
    }

    return (
        <ThemeProvider theme={theme}>
        <div className="activeBoard" style={{  height: '100%'  }}>
            <div className="boardHeadingStyle">
                <div style={{ fontSize: 'larger', fontWeight: 'bold' }}>
                    <Typography style={{ textTransform: 'uppercase', color: 'white'}} component="h1" variant="h5">{projectName}
                      {value.isProjectBoss() && (<Fab size="small" onClick={() => history.push(`/projects/${activeProjectID}`)} className={classes.fab}><EditIcon style={{ size: 'large', color: 'white', marginBottom: '5%' }}></EditIcon></Fab>)}
                    </Typography>                  
                </div>
                <Button id="to-backlog" className={classes.button} onClick={() => history.push(`/backlog/${match.params.id}`)} variant="contained">Go to backlog</Button>

            </div>
            <div className={"dndContainer"}>
                <DragDropContext onDragEnd={handleDragEnd}>
                    {_.map(state, (data, key) => {
                        return (

                            <div key={key} className={"column"} style={{background: 'linear-gradient(rgba(13, 17, 31, 0.514), transparent 100%)', backgroundColor: value.state.checkedA ? 'rgba(13, 17, 31, 0.514)' : 'transparent', boxShadow: '2px 20px 20px rgba(27, 28, 43, 0.514)'}}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><h3><span style={{color: 'white'}}>{data.title}</span></h3>
                                    </div>

                                    <Droppable droppableId={key}>
                                        {(provided, snapshot) => {
                                            return (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.droppableProps}
                                                    className={"droppable-col"}
                                                >
                                                    {data.items.map((el, index) => {
                                                        return (
                                                            <Draggable id="draggable-task" key={el.id} index={index} draggableId={el.id}>
                                                                {(provided, snapshot) => {
                                                                    return (
                                                                        <div
                                                                            className={`item ${snapshot.isDragging && "dragging"} ${ value.state.checkedA ? classes.border : ''} ${el.priority === "MEDIUM" ? "medium" : (el.priority === "LOW" ? "low" : "high")}`}
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                        >
                                                                            <div className="boardTask" style={{color: 'white'}}>
                                                                                <ViewTask task={el} projectId={activeProjectID} add={false} />

                                                                                <Tooltip title="Move back to backlog">
                                                                                    <ReplyIcon id="move-back-to-backlog" onClick={() => sendToBacklog(el)} style={{ marginBottom: "px", cursor: 'pointer', fontSize: 'medium', color: 'white' }}></ReplyIcon>
                                                                                </Tooltip>

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

                                <div className="addTask" style={{ cursor: 'pointer', color: 'white'}} > <ViewTask status={key} task={{}} projectId={activeProjectID} add={true} /> <AddIcon style={{ fontSize: 'medium', verticalAlign: 'bottom', height: '100%' }}></AddIcon></div>

                            </div>
                        )
                    })}
                </DragDropContext>
            </div>

        </div>
        </ThemeProvider>
    )
}

export default ActiveBoard