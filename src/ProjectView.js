import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import ReactDOM from "react-dom";
import Backg from "../assets/images/poster2.jpg";
import { Image } from "react-bootstrap";
import firebase from "firebase";
import Firestore from "./Firestore.js";

import "./index.css";
const styles = theme => ({
  root: {
    margin: 0,
    padding: 0,
    borderRadius: 17
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: "#ababab"
  }
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography className='projectDialogTitle' >{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const archive = (projectID) => {
    var uid = firebase.auth().currentUser.uid;
    Firestore.archiveProject(uid, projectID);
}

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

const ProjectView = ({ open, hide, projectInfo, edit }) =>
  open
    ? ReactDOM.createPortal(
        <React.Fragment>
          <Dialog
            onClose={hide}
            aria-labelledby="customized-dialog-title"
            open={open}
            classes={{ paper: "projectDialog" }}
          >
            <div>
              <Image fluid src={projectInfo.image} />
              <h3 className='projectDialogTitle'>{projectInfo.title}</h3>
            <br/>
            <h3 className='projectDialogSubtitle'>{projectInfo.subtitle}</h3>
            <h3 className='projectDialogMedium'>{projectInfo.medium} Project</h3>
            </div>
            <DialogTitle id="customized-dialog-title" onClose={hide}>
            </DialogTitle>
            {/* <DialogContent dividers>
              <Typography gutterBottom>
              </Typography>
            </DialogContent> */}
            <DialogActions>
            <Button onClick={() => {archive(projectInfo.projectID); hide()}} color="secondary">
                Archive
              </Button>
              <Button onClick={() => {hide(); edit(projectInfo)}} color="primary">
                Edit
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>,
        document.body
      )
    : null;

export default ProjectView;
