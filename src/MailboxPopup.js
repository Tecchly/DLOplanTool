import React from "react";
import MailboxListBox from "./MailboxListBox";
import { Modal, Button, ButtonToolbar } from "react-bootstrap";

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
            <ButtonToolbar>
                <Button style={{
                    backgroundColor: "#FA8231",
                    color: "#fff",
                    borderRadius: 11,
                    marginLeft: "90%",
                    width: "10%",
                    minWidth: 130,
                    marginTop: "-2.5%",
                    height: 35,
                    minHeight: 35,
                    boxShadow: "0px 2px 10px -4px rgba(0,0,0,0.5)",
                    border: "none",
                    fontFamily: "Montserrat",
                    fontWeight: "600"
                }}
                    onClick={() => this.toggleMailPopup()}>
                    Notifications
                    </Button>


                <Modal
                    show={this.state.mailModalShow}
                    onHide={() => this.toggleMailPopup()}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="notifications">
                            Notifications
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <MailboxListBox pageSize={8} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button style={{
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
                            onClick={() => this.toggleMailPopup()}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </ButtonToolbar>
        );
    }
}

export default MailboxPopup;
