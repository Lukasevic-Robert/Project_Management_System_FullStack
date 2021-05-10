import React, { useContext, useEffect } from 'react'
import { Link } from "react-router-dom";
import { ProjectContext } from "../context/ProjectContext";


const ViewProjectTasks = ({ match }) => {
    const { setActiveProject} = useContext(ProjectContext);

    useEffect(() => {
        setActiveProject(match.params.id)
    }, [match]);

    return (
        <div>
            <h3>
                Viewing project tasks of project nr: {match.params.id}
            </h3>

            <div>
                <Link to={`/projects`}>
                    <button className="btn btn-info btn">Go back</button>
                </Link>
            </div>

            <div>
                <br/>
            <Link to={`/active-board/${match.params.id}`}>
                        <button className="btn btn-info btn">Go to active board</button>
                        </Link>
                        
        </div>

        </div>
    )
}

export default ViewProjectTasks