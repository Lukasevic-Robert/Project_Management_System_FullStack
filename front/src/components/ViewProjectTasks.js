import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import _ from "lodash";
import { v4 } from "uuid";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import CancelIcon from '@material-ui/icons/Cancel';
import { Fab } from '@material-ui/core';

const ViewProjectTasks = ({ match }) => {
    const[tasks,setTasks]=useState([
                {id:v4(),
                    projectId:1,
                name:"P1",
            description:"descr task1",
            priority:"low",
        status:"todo",
        creationDate:5,
        renewalDate:2},
        {id:v4(),
            projectId:1,
        name:"P4",
    description:"descr task4",
    priority:"low",
status:"done",
creationDate:5,
renewalDate:2},
        {id:v4(),
            projectId:1,
        name:"P2",
    description:"descr task 2",
    priority:"high",
status:"done",
creationDate:5,
renewalDate:2},
{id:v4(),
    projectId:1,
name:"P3",
description:"descr task 3",
priority:"medium",
status:"inProgress",
creationDate:5,
renewalDate:2}
            ]);

// mapping tasks
            let todoItems = [];
            let inProgressItems = [];
            let doneItems = [];
        
        // const someFunction=()=>{
            for (let i = 0; i < tasks.length; i++) {
            //    console.log(tasks[i]);
                if (tasks[i].status === "todo") {
                  todoItems.push(tasks[i]);
                }
                if (tasks[i].status === "inProgress") {
                  inProgressItems.push(tasks[i]);
                }
                if (tasks[i].status === "done") {
                  doneItems.push(tasks[i]);
                }
              }
        // }
        // end maping tasks

    const [text, setText] = useState('');

    const [state, setState] = useState({
        "todo": {
            title: "Todo",
            items: todoItems
        },
        "inProgress": {
            title: "In progress",
            items: inProgressItems
        },
        "done": {
            title: "Done",
            items: doneItems
        }
    })

    const handleDragEnd = ({ destination, source,draggableId }) => {
        // console.log("from",source)
        // console.log("to", destination)
        console.log("***"+draggableId);
        if (!destination) {
            return
        }
        if (destination.index === source.index && destination.droppableId === source.droppableId) {
            return
        }
        //creating a copy of item before removing it from state
        const itemCopy = { ...state[source.droppableId].items[source.index] }
        setState(prev => {
            prev = { ...prev }
            // remove from previous item array
            prev[source.droppableId].items.splice(source.index, 1)
            //adding to new items array location
            prev[destination.droppableId].items.splice(destination.index, 0, itemCopy)
            return prev
        })

        updateTask(draggableId, destination.droppableId)
    }


const updateTask=(taskId, newStatus)=>{
    let taskToUpdate=tasks.find(item=>item.id===taskId);
   taskToUpdate.status=newStatus;
    // UserService.updateTask(taskToUpdate, match.params.id, taskId).then(res => {
    //    console.log(res);
    // })
    //     .catch((error) => {
    //         console.log(error);
    //     }
    //     );
}


const sendToBacklog=(taskId, status)=>{
 //let taskIndex= find(item=>item.id===taskId);
//     let taskToUpdate=tasks.find(item=>item.id===taskId);
//    taskToUpdate.status="backlog";
    setState(prev => {
     prev = { ...prev }
//     // setTasks(prev.source.filter((taskToUpdate) => taskToUpdate.id !== draggableId));
// for(let i=0;i<Object.keys(prev).length;i++){


// }
let taskIndex=prev[status].items.findIndex(item=>item.id===taskId);
     prev[status].items.splice(taskIndex, 1)
     return prev
 })
//     UserService.updateTask(taskToUpdate, match.params.id, taskId).then(res => {
//         setTasks(tasks.filter((taskToUpdate) => taskToUpdate.id !== taskId));
//     })
//         .catch((error) => {
// console.log(error)        }
       //  );
}

    const addItem = () => {
        setState(prev => {
            return {
                ...prev,
                todo: {
                    title: "To do",
                    items: [{
                        id: v4(),
                        name: text
                    },
                    ...prev.todo.items]
                }
            }
        })
        setText("")
    }

    return (
        <div>
           <div className="projectHeadingStyle">
            <h3>
                Viewing project tasks of project nr: {match.params.id}
            </h3>
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

                                {/* //dropable and dragable ids have to strings, cannpt be integers */}
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
                                                                        className={`item ${snapshot.isDragging && "dragging"} ${el.priority=="medium"?"medium":(el.priority=="low"?"low":"high")}`}
                                                                        ref={provided.innerRef}
                                                                        //draggable props required to handle drag and drop
                                                                        {...provided.draggableProps}
                                                                        //handle so that react knows which element to drag by
                                                                        {...provided.dragHandleProps}
                                                                    >
                                                                 
                                                    <CancelIcon id="icon" fontSize="small" onClick={() => sendToBacklog(el.id, el.status)} style={{marginRight:"15px", cursor: 'pointer'}}></CancelIcon>

                                                    <Link to={`/api/v1/tasks/${match.params.id}/${el.id}`}>
                                            <div> {el.description}</div>
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

            <div>
                <br>
                </br>
                <input type="text" value={text} onChange={(e) => setText(e.target.value)}></input>
                <button onClick={addItem}>Add a task</button>
            </div>


            
        </div>
    )
}

export default ViewProjectTasks