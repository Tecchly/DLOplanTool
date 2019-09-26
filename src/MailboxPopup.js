import React from "react";
import MailboxListBox from "./MailboxListBox";
import { Modal, Button, ButtonToolbar } from "react-bootstrap";
import IconButton from "@material-ui/core/IconButton";
import NotificationIcon from "@material-ui/icons/Notifications";
import "./index.css";
class MailboxPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { mailModalShow: false };
  }

  toggleMailPopup() {
    this.setState({ mailModalShow: !this.state.mailModalShow });
  }

  render() {
    return (
      <ButtonToolbar className="buttonToolbar">
        <IconButton
          aria-label="notifications"
          onClick={() => this.toggleMailPopup()}
          style={{color: "#FA8231"}}
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
            <MailboxListBox pageSize={8} />
          </Modal.Body>
          <Modal.Footer>
            <Button
              style={{
                backgroundColor: "#FA8231",
                color: "#fff",
                borderRadius: 11,
                marginRight: "5%",
                width: "10%",
                boxShadow: "0px 2px 10px -4px rgba(0,0,0,0.5)",
                border: "none",
                fontFamily: "Montserrat",
                height: 35,
                fontWeight: "600"
              }}
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

export default MailboxPopup;
