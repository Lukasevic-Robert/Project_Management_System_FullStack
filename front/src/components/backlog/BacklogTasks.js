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
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import { Box, Card, CardContent, Grid, LinearProgress, Typography, Paper, Button, InputBase  } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { ProjectContext } from "../../context/ProjectContext";
import SaveIcon from '@material-ui/icons/Save';
import SearchIcon from '@material-ui/icons/Search';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';

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
    purple: {
        backgroundColor: 'purple',
        width: '25px',
        height: '25px',
        fontSize: '12px',
        marginRight: '2px'
    },
    content: {
        wordWrap: 'break-word',
    },
    button: {
        margin: theme.spacing(1),
        color: 'white',
        marginLeft: 'auto',
        display: 'flex',
        marginRight: '2%',
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
}
);

const BacklogTasks = ({ match }) => {

    const { activeProjectId, setLocation, refreshBacklog, setRefreshBacklog } = useContext(ProjectContext);
    const classes = useStyles();
    const [activeTasks, setActiveTasks] = useState([]);
    const [backlogTasks, setBacklogTasks] = useState([]);
    const [totalTasksCount, setTotalTasks] = useState(0);
    const [unfinishedTasksCount, setUnfinishedTasks] = useState(0);
    const history = useHistory();
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
            await TaskService.getActiveTasks(activeProjectId).then(
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
            await TaskService.getBacklogTasks(activeProjectId).then(
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
    }, [activeProjectId, refreshBacklog]);

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
        // itemCopy.status
        if(destination.droppableId==="ACTIVE"){itemCopy.status="TODO"}
        if(destination.droppableId==="BACKLOG"){itemCopy.status="BACKLOG"}

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
            setBacklogTasks([...backlogTasks,taskToUpdate]);
            setActiveTasks(activeTasks.filter((task) => task.id !== taskId
            ))
        }
        else {
            taskToUpdate.status = 'TODO';
            setActiveTasks([...activeTasks,taskToUpdate]);
            setBacklogTasks(backlogTasks.filter((task) => task.id !== taskId
            ))
        }

        TaskService.updateTask(taskToUpdate, taskId).then(res => {
            // setRefreshBacklog(!refreshBacklog);
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

    // GET PROJECT DATA    
    const getUsers = () => {
        ProjectService.getProjectById(activeProjectId).then((res) => {
            let project = res.data;
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
const deleteFunction = (taskId, taskName) =>{
    swal({
        text: `Are you sure you want to delete task: ${taskName}?`,
        // text: "You won't be able to revert this!",
        icon: 'warning',
        className: "swalFont",
        buttons: ["Cancel", "Yes, delete it!"],
        dangerMode: true,
        }).then( async (isConfirm)=>{
          if (isConfirm) {
            await TaskService.deleteTask(taskId).then(res => {
                getSuccessMessage("deleted");
                setRefreshBacklog(!refreshBacklog);
            })
                .catch((error) => {
                    getErrorMessage();
                }
                );
            setTotalTasks(totalTasksCount - 1);
            setUnfinishedTasks(unfinishedTasksCount - 1);
          }
        })  
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

    const getTasksCSV = (projectId) => {
        TaskService.requestTasksCSV(projectId);
    }

// SEARCH TASKS
const [searchRequest, setSearchRequest] = useState('');
    const handleSearch=(event)=>{
setSearchRequest(event.target.value);
  setState((state)=>{
    state = { ...state }
    let activeNotDone= activeTasks.filter((item) => item.status !== "DONE");

     state.ACTIVE.items=activeNotDone.filter((item) => {
        return  item.name.toLowerCase().includes(event.target.value.toLowerCase())
      });

      state.BACKLOG.items=backlogTasks.filter((item) => {
        return  item.name.toLowerCase().includes(event.target.value.toLowerCase())
      });

    return state;
  });
    }
   

    return (
        <ThemeProvider theme={theme}>
        <div className="activeBoard">
            <div style={{ fontSize: 'larger', fontWeight: 'bold', marginLeft: '20px', paddingTop: '10px'}}>
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
                                    <Typography color="textPrimary" variant="h5">{totalTasksCount && (Math.round(100 - unfinishedTasksCount / totalTasksCount * 100))}%</Typography>
                                    <Box >
                                        <LinearProgress style={{ height: '5px', color: 'black' }}
                                            value={totalTasksCount ? (100 - unfinishedTasksCount / totalTasksCount * 100) : 0} variant="determinate" />
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    </div>
                </div>
            </div>
            <Button id="task-csv" onClick={() => getTasksCSV(activeProjectId)} variant="contained" color="primary" size="small" className={classes.button} startIcon={<SaveIcon />}>Save .csv</Button>
            <div className="headingStyleBacklog2">  
            <div style={{display:'flex'}}>
            <Button size="small" style={{color: '#4caf50'}}><AddIcon /><ViewTask task={{}} status='BACKLOG' projectId={activeProjectId} add={true} /></Button>
                {/* <div style={{ display: 'flex', justifyContent: 'right' }}><AddIcon /><ViewTask task={{}} status='BACKLOG' projectId={activeProjectId} add={true} /> */}
                {/* <SortIcon ></SortIcon>Sort<FilterListIcon></FilterListIcon>Filter<SearchIcon></SearchIcon>Search   */}
                {/* </div> */}

                <Paper id="search-bar" component="form" className={classes.search}>
                            <InputBase id="search-input"
                                className={classes.input}
                                placeholder="Search..."
                                inputProps={{ 'aria-label': 'search google maps' }}
                                onChange={handleSearch}
                                value={searchRequest}
                            />
                                    <SearchIcon  className={classes.iconButton} color="primary" aria-label="search"/>
                        </Paper>
                        </div>
                <div> <Link to={`/active-board/${match.params.id}`}>
                    <button className="btn" style={{ backgroundColor: '#7eb8da', color: 'white' }}>Go to active board</button>
                </Link> </div>
            </div>
            <div className={"dndContainerBacklog"}>
                <DragDropContext onDragEnd={handleDragEnd}>
                    {_.map(state, (data, key) => {
                        return (
                            <div key={key} className={"column"}>
                                <div>
                                    <div><Typography color="textPrimary" variant="h6" style={{padding: 10}}>{data.title}</Typography>
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
                                                                                <div style={{paddingTop:'2%', paddingBottom:'2%'}}>
                                                                                    <ViewTask task={el} status='BACKLOG' projectId={activeProjectId} add={false} />
                                                                                </div>
                                                                                <div>
<div style={{display:'flex', height:'100%'}}>
                                                                                                                                                            
<div className="calendar"> <EventAvailableIcon style={{ fontSize: 10 }}/>   Updated: {el.updated.replace("T", " ").substr(0, 16)}</div>
</div></div>

                                                                                </div>

                                                                                <div style={{display:'flex', alignItems:'center'}}>


                                                                                <div style={{color:'grey', fontSize:'smaller', justifyContent:'center'}}>
     {el.status==='TODO'?<SentimentVeryDissatisfiedIcon/>:(el.status==='BACKLOG'? '':<SentimentSatisfiedIcon/>)}  
       
        {el.status==='IN_PROGRESS'? 'IN PROGRESS':(el.status==='TODO'?'TO DO':'')}
          
        </div>
                                                                                    <DeleteIcon id="icon" onClick={() => deleteFunction(el.id, el.name)} style={{ fontSize: 'large', color: 'grey', cursor: 'pointer' }} />
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
                                    <hr />
                                </div>

                            </div>
                        )
                    })}
                </DragDropContext>
        
            </div>

        </div>
        </ThemeProvider>
    )
}

export default BacklogTasks