import React, { useEffect } from "react";
import { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import ReactDOM from "react-dom";

import { Image } from "react-bootstrap";
import firebase from "firebase";
import Firestore from "./Firestore.js";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";
import Chips from "react-chips";
import "./style.scss";
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
      <Typography className="projectDialogTitle">{children}</Typography>
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

const archive = projectID => {
  var uid = firebase.auth().currentUser.uid;
  Firestore.archiveProject(uid, projectID).then(() => {
  }).catch(error => {
    console.error("Archive project failure, " + error);
  });
  
};

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

const ProjectView = ({ open, hide, projectInfo, removeProject, edit, shared }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [tags, addTags] = useState([]);

  const clearTags = () => {
    addTags([]);
  }
  const addTag = t => {
    addTags(t);
  };
  const onChange = tags => {
    addTag(tags);
  };
  const addSuggestion = s => {
    setSuggestions(oldArray => [...oldArray, s]);
  };

  const clearSuggestions = () => {
    setSuggestions([]);
  };
  const shareProject = () => {
    var data = {
      archived: false,
      id: projectInfo.projectID,
      title: projectInfo.title,
      subtitle: projectInfo.subtitle,
      medium: projectInfo.medium,
      image: projectInfo.image,
      medium: projectInfo.medium,
      shareTime: +new Date(),
      createUser: "",
      path: ""
    };

    var user = firebase.auth().currentUser;
    data.createUser = user.displayName;
    data.path = "users/" + user.uid + "/projects/" + data.id; //+ this.projectId

    // var shareEmails = tags;
    tags.forEach(function(email) {
      Firestore.getUsersByEmail(email.trim())
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            Firestore.shareProject(doc.id, data).then(() => {
            }).catch(error => {
              console.error("Project share failure, " + error);
            });
          });
        }).catch(function(error) {
          console.error("Error getting documents, " + error);
        });
    });

    clearSuggestions();
  };
  useEffect(() => {
    Firestore.getUsers().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        addSuggestion(doc.data().email);
      });
    });
  }, []);
  return open
    ? ReactDOM.createPortal(
        <React.Fragment>
          <Dialog
            onClose={()=> { clearTags(); hide();}}
            aria-labelledby="customized-dialog-title"
            open={open}
            classes={{ paper: "projectDialog" }}
          >
            <div >
              <Image fluid src={projectInfo.image} style={{borderTopLeftRadius: 17, borderTopRightRadius: 17 }}/>
              <h3 className="projectDialogTitle">{projectInfo.title}</h3>
              <br />
              <h3 className="projectDialogSubtitle">{projectInfo.subtitle}</h3>
              <h3 className="projectDialogMedium">
                {projectInfo.medium} Project
              </h3>
            </div>
            
            <DialogTitle
              id="customized-dialog-title"
              onClose={()=> { clearTags(); hide();}}
            ></DialogTitle>
            {shared ? null : (
            <DialogContent
              dividers
              style={{ overflow: 'visible' }}
            >
              <h3 className="shareHeaderProjectView">
                Share Project
              </h3>
              <div className="recipientField">
              <Chips

                value={tags}
                placeholder="recipients"
                onChange={onChange}
                suggestions={suggestions}
              />
              </div>
              <div >
              <IconButton
                aria-label="send"
                onClick={() => {
                  clearTags();
                  hide();
                  shareProject();
                }}
                className={tags.length==0?"sendPlaneDisabled":"sendPlane"}
                disabled={tags.length==0}
              >
                <SendIcon fontSize="default" />
              </IconButton>
              </div>
            </DialogContent>)}
            <DialogActions>
              {shared ? null : (
                <Button
                  onClick={() => {
                    archive(projectInfo.projectID);
                    removeProject(projectInfo.projectID);
                    clearTags();
                    hide();
                  }}
                  classes={{ root: "projectViewSecondary" }}
                >
                  Archive
                </Button>
              )}
              <Button
                onClick={() => {
                  clearTags();
                  hide();
                  edit(projectInfo);
                }}
                classes={{ root: "projectViewPrimary" }}
              >
                {shared ? "View" : "Edit"}
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>,
        document.body
      )
    : null;
};

export default ProjectView;
