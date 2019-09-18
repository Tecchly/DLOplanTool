import React from "react";
import { app } from "./Firebase";
import "./MailboxPopup.css";
import { Button, Icon } from "antd";
import { withRouter, Redirect } from "react-router";
import firebase from "firebase";
import Firestore from "./Firestore.js";
import Ionicon from "react-ionicons";
import MailboxListBox from "./MailboxListBox";

class MailboxPopup extends React.Component {
    constructor(props) {
        super(props);
        // this.state = { totalData: this.Mailbox() };
    }

    // Mailbox() {
    //     var user = firebase.auth().currentUser;
    //     var sharedProjects = Firestore.getAllSharedProjectsByUser(user.uid);
    //     var listMessages = [];
    //     var promises = [sharedProjects.get()];
    //     Promise.all(promises).then(docs => {
    //         docs.forEach(doc => {
    //             var proj = doc.data();
    //             listMessages.push(proj);
    //         })
    //     });
    //     // }
    //     // });
    //     console.log(listMessages);
    //     return listMessages;
    // }

    render() {
        var togglePopup = this.props.togglePopup;
        const { history } = this.props;
        return (
            <React.Fragment>
                <div className="mailboxpopup">
                    <div className="inner">
                        <Ionicon
                            style={{
                                position: "absolute",
                                right: "15px",
                                top: "15px",
                                cursor: 'pointer',
                            }}
                            icon="md-close"
                            onClick={this.props.closePopup}
                        />

                        <div className="Mailbox"
                            style={{
                                marginLeft: "1%",
                                marginRight: "5%",
                                marginTop: "10%"
                            }}
                        >
                            <MailboxListBox pageSize={4} />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default MailboxPopup;
