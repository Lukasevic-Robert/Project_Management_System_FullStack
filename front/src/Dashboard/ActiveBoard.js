import React, { useState, useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import _ from "lodash";
import { Link } from "react-router-dom";
import TaskService from "../services/TaskService.js"
import ViewTask from "./ViewTask"
import swal from 'sweetalert';
import { useHistory } from 'react-router';
import UserService from "../services/UserService";
import ProjectService from "../services/ProjectService";
import { Avatar } from "@material-ui/core"
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core/styles';


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
    purple:{
        backgroundColor: 'purple',
        width:'25px',
        height:'25px',
        fontSize: '12px',
        marginRight: '2px'
            }
}
);

const ActiveBoard = ({ match }) => {
    const activeProjectID = match.params.id;
    const classes = useStyles();
    const [activeTasks, setActiveTasks] = useState([]);
    const [errors, setErrors] = useState([]);
    const history = useHistory();
    const [initials, setInitials] = useState(['AZ']);
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

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            await TaskService.getActiveTasks(activeProjectID).then(
                response => {
                    if (isMounted) {
                        setActiveTasks(response.data);
                        mapByStatus(response.data);
                        //   console.log(response);
                       // getUsers();
                     //   console.log(initials)
                    }
                })
                .catch((error) => {
                    getErrorMessage();
                    history.push('/api/v1/projects');
                }
                );
        };
        fetchData();
        return () => { isMounted = false };
    }, [activeProjectID]);


    // map tasks by status
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


    // end maping tasks  



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

    const updateTask = (taskId, newStatus) => {
        let taskToUpdate = activeTasks.find(item => item.id === taskId);
        taskToUpdate.status = newStatus;
        TaskService.updateTask(taskToUpdate, taskId).then(res => {
          //  console.log(res);
        })
            .catch((error) => {
                getErrorMessage();
              //  history.push('/api/v1/projects');
            }
            );
    }

    const getErrorMessage = () => {
        const errorMessage = swal({
            text: "Something went wrong! ",
            button: "Go back to backlog",
            icon: "warning",
            dangerMode: true,
        });
        return errorMessage;
    }

   

const getUsers = () =>{
    
    setInitials([]);
    console.log("reset initials:" +initials);
    ProjectService.getProjectById(activeProjectID).then((res) => {
        let project = res.data;
       

        // let users = [];
        // let userId = [];
        project.users.map((user) => {
          let userInitials= user.firstName.charAt(0)+user.lastName.charAt(0)
            setInitials([...initials,userInitials])
            console.log("***"+initials);
        })
        // this.setState({ title: project.name, status: project.status, content: project.description, personName: users, userListId: userId });
    })
        .catch((error) => {
            this.getErrorMessage();
            // this.props.history.push('/api/v1/projects');
        });
}

    return (
        <div className="activeBoard">
            <div  className="projectHeadingStyle">
                <div>
                   Project nr. {match.params.id}
                </div>
            </div>
            <div className={"dndContainer"}>
                <DragDropContext onDragEnd={handleDragEnd}>
                    {_.map(state, (data, key) => {
                        return (
                            <div key={key} className={"column"}>
                                <h3>{data.title}</h3>
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
                                                        <Draggable key={el.id} index={index} draggableId={el.id}>
                                                            {(provided, snapshot) => {
                                                                return (
                                                                    <div
                                                                        className={`item ${snapshot.isDragging && "dragging"} ${el.priority === "MEDIUM" ? "medium" : (el.priority === "LOW" ? "low" : "high")}`}
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                    >
                                                                        <div>
                                                                        <ViewTask task={el} />
                                                                        </div>
                                                                        
                                                                       <div> 
                                                                       {
     initials.map((item,index) => (
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
                        )
                    })}
                </DragDropContext>
            </div>
        </div>
    )
}

export default ActiveBoard