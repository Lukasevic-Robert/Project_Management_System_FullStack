import React, { useState, useEffect, useContext } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import _ from "lodash";
import { Link } from "react-router-dom";
import TaskService from "../../services/TaskService.js"
import ViewTask from "./ViewTask"
import swal from 'sweetalert';
import { useHistory } from 'react-router';
import ProjectService from "../../services/ProjectService";
import { Avatar } from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles';
import SortIcon from '@material-ui/icons/Sort';
import FilterListIcon from '@material-ui/icons/FilterList';
import SearchIcon from '@material-ui/icons/Search';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from "@material-ui/core/Tooltip";
import ReplyIcon from '@material-ui/icons/Reply';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import { ProjectContext } from '../../context/ProjectContext';
import { AuthContext } from '../../context/AuthContext';


const useStyles = makeStyles({
    purple: {
        backgroundColor: 'purple',
        width: '30px',
        height: '30px',
        fontSize: '12px',
        marginRight: '2px'
    }
}
);

const ActiveBoard = ({ match }) => {
    const { projectName, setLocation, refreshActive} = useContext(ProjectContext);
    const { isProjectBoss } = useContext(AuthContext);
    const activeProjectID = match.params.id;
    const classes = useStyles();
    const [activeTasks, setActiveTasks] = useState([]);
    const history = useHistory();
    const [initials, setInitials] = useState([]);
    let randomColor = Math.floor(Math.random() * 16777215).toString(16);
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
                        getUsers();
                     //   console.log(response.data)
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
        // console.log("from",source)
        // console.log("to", destination)
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
                //  history.push('/api/v1/projects');
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

    // GET USERS LIST from database and set initials    
    const getUsers = () => {
        ProjectService.getProjectById(activeProjectID).then((res) => {
            setInitials(initials => {
                initials = [...initials]
                initials = [];
                return initials;
            })
            let project = res.data;
            // let users = [];
            // let userId = [];
            project.users.map((user) => {
                let userInitials = user.firstName.charAt(0).trim() + user.lastName.charAt(0).trim();
                setInitials(initials => {
                    initials = [...initials]
                    initials.push(userInitials);
                    return initials;
                })
            })
            // setProject({ title: project.name, status: project.status, content: project.description, personName: users, userListId: userId });
        })
            .catch((error) => {
                getErrorMessage();
                history.push('/projects');
            });
    }

    const addTask = () => {
        // history.push({

        // }
        //     `/tasks/:activeProjectID/-1`);
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
                //  history.push('/api/v1/projects');
            }
            );
    }

    return (
        <div className="activeBoard">
            <div className="boardHeadingStyle">
                <div style={{ fontSize: 'larger', fontWeight: 'bold' }}>
                    <Typography style={{ textTransform: 'uppercase' }} component="h1" variant="h5">{projectName}
                      {isProjectBoss() && (<Link id="link-to-edit-projects2" to={`/projects/${activeProjectID}`}><EditIcon style={{ size: 'large', color: '#be9ddf', marginBottom: '5%' }}></EditIcon></Link>)}
                    </Typography>
                </div>

                {/* <div style={{ fontSize: 'smaller' }}><SortIcon></SortIcon>Sort
                <FilterListIcon></FilterListIcon>Filter<SearchIcon></SearchIcon>Search</div> */}
            </div>
            <div className={"dndContainer"}>
                <DragDropContext onDragEnd={handleDragEnd}>
                    {_.map(state, (data, key) => {
                        return (

                            <div key={key} className={"column"}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><h3>{data.title}</h3>
                                        {/* <MoreVertIcon style={{ color: 'grey' }}></MoreVertIcon> */}
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
                                                                            className={`item ${snapshot.isDragging && "dragging"} ${el.priority === "MEDIUM" ? "medium" : (el.priority === "LOW" ? "low" : "high")}`}
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                        >
                                                                            <div className="boardTask">
                                                                                <ViewTask task={el} projectId={activeProjectID} add={false} />
                                                                                <Tooltip title="Move back to backlog">
                                                                                    <ReplyIcon id="move-back-to-backlog" onClick={() => sendToBacklog(el)} style={{ marginBottom: "px", cursor: 'pointer', fontSize: 'medium', color: 'rgba(27, 28, 43, 0.3' }}></ReplyIcon>
                                                                                </Tooltip>

                                                                            </div>

                                                                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                                                                {
                                                                                    initials.map((item, index) => (
                                                                                        <Avatar className={classes.purple} key={index}>{item}</Avatar>
                                                                                    ))
                                                                                }
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

                                <div className="addTask" style={{ cursor: 'pointer' }} > <ViewTask status={key} task={{}} projectId={activeProjectID} add={true} /> <AddIcon style={{ fontSize: 'medium', verticalAlign: 'bottom', height: '100%' }}></AddIcon></div>

                            </div>
                        )
                    })}
                </DragDropContext>
            </div>

        </div>
    )
}

export default ActiveBoard