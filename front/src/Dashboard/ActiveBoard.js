import React, { useState, useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import _ from "lodash";
import { Link } from "react-router-dom";
import CancelIcon from '@material-ui/icons/Cancel';
import TaskService from "../services/TaskService.js"

const ActiveBoard = ({ match }) => {
    const activeProjectID = match.params.id;
    const [activeTasks, setActiveTasks] = useState([]);
    const [errors, setErrors] = useState([]);
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
                    if (isMounted) { setActiveTasks(response.data);
                        mapByStatus(response.data);
                        console.log(response)}
                   
                })
                .catch((error) => console.log(error));
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
            console.log(res);
            return res.status;
        })
            .catch((error) => {
                console.log(error);
                return error
            }
            );
    }

    return (
        <div>
            <div className="projectHeadingStyle">
                <div>
                    <Link to={`/api/v1/projects`}>
                        <button className="btn btn-info btn">Go back</button>
                    </Link>
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

                                                                        {/* <CancelIcon id="icon" fontSize="small" onClick={() => sendToBacklog(el.id, el.status)} style={{marginRight:"15px", cursor: 'pointer'}}></CancelIcon> */}

                                                                        <Link to={`/api/v1/tasks/${activeProjectID}/${el.id}`} style={{ color: 'black', textDecoration: 'none', textAlign: 'center' }}>
                                                                            {el.name}
                                                                        </Link>
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