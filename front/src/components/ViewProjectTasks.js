import React from 'react'
import { Link } from "react-router-dom";

const ViewProjectTasks = ({match}) => {
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
        </div>
    )
}

export default ViewProjectTasks