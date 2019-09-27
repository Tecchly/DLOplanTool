import React from "react";
import MailboxListBox from "./MailboxListBox";
import { Modal, Button, ButtonToolbar } from "react-bootstrap";
import IconButton from "@material-ui/core/IconButton";
import NotificationIcon from "@material-ui/icons/Notifications";
import Firestore from "./Firestore";
import firebase from "firebase";
import Badge from "@material-ui/core/Badge";
import "./style.scss";
import { withRouter, Redirect } from "react-router";
import { notification } from "antd";
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';
class MailboxPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { mailModalShow: false, notification: false };
    var user = firebase.auth().currentUser;
    this.createFnCounter = this.createFnCounter.bind(this);
    this.handleActivitySubscription = this.handleActivitySubscription.bind(this);
    // Firestore.shareListener(user.uid).onSnapshot(() => {
    //   this.setState({ notification: true });
    // });

    const handleActivitySubscriptionWithCounter = this.createFnCounter(this.handleActivitySubscription,1);
    Firestore.shareListener(user.uid).onSnapshot(handleActivitySubscriptionWithCounter);
  }

  handleActivitySubscription(snapshot) {
    this.setState({ notification: true });
    snapshot.docChanges().forEach(function(change) {          
      // console.log(change.doc.data());
      store.addNotification({
        title: change.doc.data().createUser + " shared a project with you!",
        message: change.doc.data().medium + " project: " + change.doc.data().title,
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 5000,
        }
      });          
    });

    
  }

  createFnCounter(fn, invokeBeforeExecution) {
    let count = 0;
    return args => {
      count++;
      if (count <= invokeBeforeExecution) {
        return true;
      } else {
        return fn(args, count);
      }
    };
  }

  toggleMailPopup() {
    this.setState({ mailModalShow: !this.state.mailModalShow });
    this.setState({ notification: false });
  }

  loadProject = proj => {
    const { history } = this.props;
    history.push({
      pathname: "./project",
      state: {
        createUser: proj.createUser,
        projectID: proj.id,
        medium: proj.medium,
        title: proj.title,
        topic: proj.subtitle,
        image: proj.title,
        shared: true,
        path: proj.path
      }
    });
    this.toggleMailPopup();
  };

  render() {
    return (
      
      <ButtonToolbar className="buttonToolbar">
        <ReactNotification />
        <IconButton
          aria-label="notifications"
          onClick={() => this.toggleMailPopup()}
          className="bell"
        >
          <Badge
            variant="dot"
            color="error"
            invisible={!this.state.notification}
          >
            <NotificationIcon fontSize="default" />
          </Badge>
        </IconButton>

        <Modal
          show={this.state.mailModalShow}
          onHide={() => this.toggleMailPopup()}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="notifications">Notifications</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <MailboxListBox pageSize={8} loadProject={this.loadProject} />
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="mailPopupButton"
              onClick={() => this.toggleMailPopup()}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </ButtonToolbar>
    );
  }
}

export default withRouter(MailboxPopup);
