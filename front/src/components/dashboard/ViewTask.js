import React,{useContext, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { createMuiTheme } from '@material-ui/core/styles';
import CreateTask from "../tasks/CreateTask.js";
import { AuthContext } from '../../context/AuthContext.js';


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
    background: 'linear-gradient(transparent, #4f71b8 40%, transparent 100%)',
    backgroundColor: 'transparent',
      // background: 'linear-gradient(transparent, #4f71b8 40%, transparent 100%)',
      // background: 'linear-gradient(#4f71b8 30%, transparent 100%)',
      // backgroundColor: '#151c36',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // border: '1px solid #000',
    boxShadow: theme.shadows[50],
    padding: theme.spacing(2, 4, 3),
    width: '60vw',
    height: '80vh',
    overflow: 'auto'
  },
  switched:{
      background: 'linear-gradient(#4f71b8 30%, transparent 100%)',
      backgroundColor: '#151c36',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // border: '1px solid #000',
      boxShadow: theme.shadows[50],
      padding: theme.spacing(2, 4, 3),
      width: '60vw',
      height: '80vh',
      overflow: 'auto'
  }
}));

const ViewTask = ({ location, status, task, projectId, add }) => {
  const classes = useStyles();

  const {state} = useContext(AuthContext);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <div id="button-open-create-task-form" type="button" onClick={handleOpen} style={{ width: '100%'}}>
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
        <Fade in={open}><div className={state.checkedA ? classes.switched : classes.paper}>
          {/* <div> <CloseIcon id="icon" onClick={() => handleClose()} style={{textAlign:"right", cursor: 'pointer'}}></CloseIcon></div> */}
          <div>
            <CreateTask handleClose={handleClose} taskStatus={status} taskId={task.id} projectId={projectId} add={add}></CreateTask>
          </div>
        </div>
        </Fade>
      </Modal>
    </div>
  );
}


export default ViewTask
