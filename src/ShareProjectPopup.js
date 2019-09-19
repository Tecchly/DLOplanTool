import React from "react";
import { app } from "./Firebase";
import { withRouter, Redirect } from "react-router";
import firebase from "firebase";
import Firestore from "./Firestore.js";
import { Modal, Button, ButtonToolbar } from "react-bootstrap";

class ShareProjectPopup extends React.Component {
    constructor(props) {
        super(props);

        this.localCache = window.localStorage;
        this.isProjectShared = false;
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.state = {
            shareEmails: "",
            shareModalShow: false
        };
    }



    componentDidMount() {
        //Local storage variant
        var title = this.localCache.getItem("title");
        if (title) {
            this.setState({ title: title });
        }

        var topic = this.localCache.getItem("topic");
        if (topic) {
            this.setState({ subtitle: topic });
        }

        var image = this.localCache.getItem("image");
        if (image) {
            this.setState({ image: image });
        }

        var shareEmails = this.localCache.getItem("shareEmails");
        if (shareEmails) {
            this.setState({ shareEmails: shareEmails });
        }
    }

    componentWillUnmount() {
        //If a project is shared, the local cache empties
        if (this.isProjectShared) {
            this.localCache.removeItem("title");
            this.localCache.removeItem("topic");
            this.localCache.removeItem("image");
            this.localCache.removeItem("shareEmails");
        }
    }


    handleEmailChange(event) {
        this.setState({ shareEmails: event.target.value }, function () {
            //Local cache variant
            this.localCache.setItem("shareEmails", this.state.shareEmails);
        });
    }

    uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        )
    }

    shareProject() {
        this.isProjectShared = true;
        var data = {
            id: this.uuidv4(),
            title: this.props.location.state.title,
            subtitle: this.props.location.state.topic,
            image: this.props.location.state.image,
            shareTime: + new Date(),
            createUser: "",
            path: ""
        };

        if (this.state.imageName) {
            data.image = this.state.imageName;
        }

        var user = firebase.auth().currentUser;
        data.createUser = user.displayName;
        data.path = "users/" + user.uid + "/projects/" + data.id; //+ this.projectId

        var shareEmails = this.state.shareEmails;
        shareEmails.split(/[,|\n]/).forEach(function (email) {
            Firestore.queryUserByEmail(email.trim()).get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        Firestore.saveSharedProject(doc.id, data);
                    });
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error);
                });
        });

        this.toggleSharePopup();
        this.setState({ shareEmails: "" });
        this.localCache.removeItem("shareEmails");
    }

    toggleSharePopup() {
        this.setState({ shareModalShow: !this.state.shareModalShow });
    }

    render() {
        return (
            <ButtonToolbar>
                <Button
                    style={{
                        backgroundColor: "#FA8231",
                        color: "#fff",
                        marginTop: "1%",
                        borderRadius: 11,
                        marginLeft: "90%",
                        width: "5%",
                        boxShadow: "0px 2px 10px -4px rgba(0,0,0,0.5)",
                        border: "none",
                        fontFamily: "Montserrat",
                        height: 45,
                        fontWeight: "600"
                    }}
                    variant="primary" onClick={() => this.toggleSharePopup()}>
                    Share
                    </Button>
                <Modal
                    onHide={() => this.toggleSharePopup()}
                    show={this.state.shareModalShow}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="share-project">
                            Share Project
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <div className="inputTitle">Who do you want to share this project with?</div>
                            <div className="inputEmail">
                                <textarea rows="10" cols="93"
                                    type="text"
                                    className="emailInput"
                                    placeholder="please specify the user emails here, one email one line."
                                    value={this.state.shareEmails}
                                    onChange={this.handleEmailChange}
                                    style={{
                                        fontSize: "15px",
                                        fontFamily: "Montserrat"
                                    }}
                                />
                            </div>
                        </form>
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
                            disabled={
                                this.state.shareEmails.length == 0
                            }
                            onClick={() => { this.shareProject(); }}>Share</Button>
                    </Modal.Footer>
                </Modal>
            </ButtonToolbar>
        );
    }
}

export default withRouter(ShareProjectPopup);