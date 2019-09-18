import React from "react";
import { app } from "./Firebase";
import "./ShareProjectPopup.css";
import { Button, Icon } from "antd";
import { withRouter, Redirect } from "react-router";
import firebase from "firebase";
import Firestore from "./Firestore.js";
import Ionicon from "react-ionicons";

class ShareProjectPopup extends React.Component {
    constructor(props) {
        super(props);

        this.localCache = window.localStorage;
        this.isProjectShared = false;
        this.handleEmailChange = this.handleEmailChange.bind(this);

    }

    state = {
        shareEmails: ""
    };

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
            Firestore.queryUserByEmail(email).get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        Firestore.saveSharedProject(doc.id, data);
                    });
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error);
                });
        });

        const { history } = this.props;
        history.push({
            pathname: "./",
            // state: {
            //     title: this.state.projectTitle,
            //     topic: this.state.projectTopic,
            //     image: this.state.image,
            //     creationTime: +new Date()
            // }
        });
    }


    render() {
        var togglePopup = this.props.togglePopup;
        const { history } = this.props;
        return (
            <React.Fragment>
                <div className="sharepopup">
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

                        <h1 className="shareProjectTitle">Share Project</h1>
                        <div
                            style={{
                                marginLeft: "1%",
                                marginRight: "1%"
                            }}
                        >
                            <form>
                                <div className="inputTitle">Who do you want to share this project with?</div>
                                <textarea rows="8" cols="100"
                                    type="text"
                                    className="emailInput"
                                    placeholder="please specify the user emails here, one email one line."
                                    value={this.state.shareEmails}
                                    onChange={this.handleEmailChange}
                                />
                            </form>
                        </div>
                        <div
                            className='sharedropDiv'
                            style={{
                                marginTop: "10%",
                                marginLeft: "25%",
                                marginRight: "25%",
                                textAlign: "center"
                            }}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    height: "30%",
                                    width: "50%"
                                }}
                            >

                                <br />
                                <Button
                                    style={{
                                        backgroundColor: "#FA8231",
                                        color: "#fff",
                                        marginTop: "5%",
                                        borderRadius: 11,
                                        width: "50%",
                                        boxShadow: "0px 2px 10px -4px rgba(0,0,0,0.5)",
                                        border: "none",
                                        fontFamily: "Montserrat",
                                        height: 45,
                                        fontWeight: "600"
                                    }}
                                    onClick={() =>
                                        this.shareProject()
                                    }
                                    disabled={
                                        this.state.shareEmails.length == 0
                                    }
                                >
                                    Share
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(ShareProjectPopup);
