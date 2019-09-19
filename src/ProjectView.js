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
import Backg from "../assets/images/poster2.jpg";
import { Image } from "react-bootstrap";
import firebase from "firebase";
import Firestore from "./Firestore.js";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";

import Chips, { Chip } from "react-chips";
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
  Firestore.archiveProject(uid, projectID);
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

const ProjectView = ({ open, hide, projectInfo, edit }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [share, setShare] = useState(false);
  const [tags, addTags] = useState([]);

  const addTag = t => {
    addTags(t);
  };
  const shareP = () => {
    setShare(!share);
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
      id: projectInfo.projectID,
      title: projectInfo.title,
      subtitle: projectInfo.subtitle,
      image: projectInfo.image,
      shareTime: +new Date(),
      createUser: "",
      path: ""
    };

    var user = firebase.auth().currentUser;
    data.createUser = user.displayName;
    data.path = "users/" + user.uid + "/projects/" + data.id; //+ this.projectId

    // var shareEmails = tags;
    tags.forEach(function(email) {
      Firestore.queryUserByEmail(email.trim())
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            // console.log(doc.id + " " + doc.data())
            Firestore.saveSharedProject(doc.id, data);
          });
        })
        .catch(function(error) {
          console.log("Error getting documents: ", error);
        });
    });

    // this.toggleSharePopup();
    clearSuggestions;
    // this.localCache.removeItem("shareEmails");
  };
  useEffect(() => {
    Firestore.getUserEmails().then(querySnapshot => {
      console.log(querySnapshot);
      // this.setState({suggestions: [...suggestions, ...qu]})
      querySnapshot.forEach(doc => {
        // this.setState(previousState => ({suggestions: [...previousState.suggestions, {name: doc.data().email}]}))
        addSuggestion(doc.data().email);
        // this.setState(previousState => ({
        //   suggestions: [...previousState.suggestions, doc.data().email]
        // }));
        console.log(suggestions);
      });
    });
  }, []);
  return open
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
              <h3 className="projectDialogTitle">{projectInfo.title}</h3>
              <br />
              <h3 className="projectDialogSubtitle">{projectInfo.subtitle}</h3>
              <h3 className="projectDialogMedium">
                {projectInfo.medium} Project
              </h3>
            </div>
            <DialogTitle
              id="customized-dialog-title"
              onClose={hide}
            ></DialogTitle>
            <DialogContent
              dividers
              style={{ display: share ? "block" : "none" }}
            >
              <Chips
                style={{ display: share ? "block" : "none", float: 'left',
                width:' 87%'}}
                value={tags}
                onChange={onChange}
                suggestions={suggestions}
              />
              <Button onClick={() => {hide(); shareProject();}} color="primary">
                send
              </Button>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  archive(projectInfo.projectID);
                  hide();
                }}
                color="secondary"
              >
                Archive
              </Button>
              <Button
                onClick={() => {
                  hide();
                  edit(projectInfo);
                }}
                color="primary"
              >
                Edit
              </Button>
              <Button onClick={shareP} color="primary">
                Share
              </Button>

            </DialogActions>
          </Dialog>
        </React.Fragment>,
        document.body
      )
    : null;
};

export default ProjectView;
