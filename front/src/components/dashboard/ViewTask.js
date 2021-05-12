import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { useHistory } from "react-router-dom";
import { createMuiTheme } from '@material-ui/core/styles';
import swal from 'sweetalert';
import CreateTask from "../tasks/CreateTask.js"
import CloseIcon from '@material-ui/icons/Close';

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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // border: '1px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: '60vw',
    height: '80vh',
    overflow: 'auto'
  },
}));

const ViewTask = ({location, status, task, projectId, add }) => {
  const classes = useStyles();
  const history = useHistory();

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
      <div id="button-open-create-task-form" type="button" onClick={handleOpen} style={{ width: '100%' }}>
        {add ? <div>Add new task </div> : <div>{task.name}</div>}
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
              {/* <div> <CloseIcon id="icon" onClick={() => handleClose()} style={{textAlign:"right", cursor: 'pointer'}}></CloseIcon></div> */}
<div>

  <CreateTask handleClose={handleClose} status={status} taskId={task.id} projectId={projectId} add={add}></CreateTask>
               
           
            </div>
           
          

          </div>
        </Fade>
      </Modal>
    </div>
  );
}


export default ViewTask
