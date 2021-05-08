import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import EditIcon from '@material-ui/icons/Edit';
import { ThemeProvider } from '@material-ui/styles';
import { Fab } from '@material-ui/core';
import { Link, useHistory } from "react-router-dom";
import { createMuiTheme } from '@material-ui/core/styles';
import TaskService from "../../services/TaskService.js"
import swal from 'sweetalert';

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

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    // border: '1px solid #000',
    backgroundColor:'rgb(255, 255, 255)',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: '70%',
    height: '70%'
  },
}));

const ViewTask = ({ task }) => {
  const classes = useStyles();
  const history = useHistory();

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const sendToBacklog=()=>{
    task.status = "BACKLOG";
    TaskService.updateTask(task, task.id).then(res => {
        console.log(res);
        handleClose();
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

  return (
    <div>
      <div type="button" onClick={handleOpen} style={{width: '100%'}}>
        {task.name}
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
              <div className="projectHeadingStyle">
<div>
<h2 id="transition-modal-title">{task.name}</h2>
</div>
<div>
            <Link to={`/api/v1/projects/${task.id}`}>
                                                <Fab size="small" color="secondary" aria-label="Edit" className={classes.fab}>
                                                    <EditIcon id="icon"></EditIcon>
                                                </Fab>
                                            </Link>
                                            {/* <Fab size="small" color="secondary" aria-label="Edit" className={classes.fab}>
                                             <CancelIcon id="icon" onClick={() => sendToBacklog(id)} style={{marginRight:"15px", cursor: 'pointer'}}></CancelIcon>
                                             </Fab> */}
            </div>
           
            </div>
<div>
    {
     task.description.map((item) => (
        <p id="transition-modal-description" key={item}>{item}</p>
     ))
     }   
    
    </div>
           
            
            <button className="btn btn-info btn" onClick={() => sendToBacklog()}>Move to backlog</button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}


export default ViewTask
