import React from "react";
import MailboxListBox from "./MailboxListBox";
import { Modal, Button, ButtonToolbar } from "react-bootstrap";
import IconButton from "@material-ui/core/IconButton";
import NotificationIcon from "@material-ui/icons/Notifications";
import "./style.scss";
import { withRouter, Redirect } from "react-router";

class MailboxPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { mailModalShow: false };
  }

  toggleMailPopup() {
    this.setState({ mailModalShow: !this.state.mailModalShow });
  }

  loadProject = (proj) => {
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
  }

  render() {
    return (
      <ButtonToolbar className="buttonToolbar">
        <IconButton
          aria-label="notifications"
          onClick={() => this.toggleMailPopup()}
          className="bell"
        >
          <NotificationIcon fontSize="default" />
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
            <MailboxListBox pageSize={8} loadProject={this.loadProject}/>
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
