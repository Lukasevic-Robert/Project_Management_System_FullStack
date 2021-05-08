import React from 'react'
import { Link } from "react-router-dom";

const ViewProjectTasks = ({match}) => {
    return (
        <div>
            <h3>
            Viewing project tasks of project nr: {match.params.id}
            </h3>
          {/* //  /api/v1/tasks/:{match.params.id}/active */}
            <div>
            <Link to={`/api/v1/tasks/${match.params.id}/active`}>
                        <button className="btn btn-info btn">Go to active board</button>
                        </Link>
        </div>
        </div>
    )
}

export default ViewProjectTasks