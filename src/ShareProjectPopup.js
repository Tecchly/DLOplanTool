import React from "react";
import { app } from "./Firebase";
import { withRouter, Redirect } from "react-router";
import firebase from "firebase";
import Firestore from "./Firestore.js";
import { Modal, ButtonToolbar } from "react-bootstrap";
import Button from "@material-ui/core/Button";
import Chips, { Chip } from "react-chips";

class ShareProjectPopup extends React.Component {
  constructor(props) {
    super(props);

    this.localCache = window.localStorage;
    this.isProjectShared = false;
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.state = {
      shareEmails: "",
      shareModalShow: false,
      suggestions: [],
      tags: []
    };
    this.onChange = this.onChange.bind(this);
  }
  onChange = tags => {
    this.setState({ tags });
  };
  componentDidMount() {
    var users = [];
    var shareEmails = this.localCache.getItem("shareEmails");
    if (shareEmails) {
      this.setState({ shareEmails: shareEmails });
    }
    Firestore.getUsers().then(querySnapshot => {
      console.log(querySnapshot);
      // this.setState({suggestions: [...suggestions, ...qu]})
      querySnapshot.forEach(doc => {
        // this.setState(previousState => ({suggestions: [...previousState.suggestions, {name: doc.data().email}]}))
        this.setState(previousState => ({
          suggestions: [...previousState.suggestions, doc.data().email]
        }));
        console.log(this.state.suggestions);
      });
    });
    // this.setState({ suggestions: users });
  }

  componentWillUnmount() {
    //If a project is shared, the local cache empties
    if (this.isProjectShared) {
      this.localCache.removeItem("shareEmails");
    }
  }

  handleEmailChange(event) {
    this.setState({ shareEmails: event.target.value }, function() {
      //Local cache variant
      this.localCache.setItem("shareEmails", this.state.shareEmails);
    });
  }

  // uuidv4() {
  //     return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
  //         (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  //     )
  // }

  shareProject() {
    this.isProjectShared = true;

    var data = {
      archived: false,
      id: this.props.projectId,
      title: this.props.title,
      subtitle: this.props.subtitle,
      image: this.props.image,
      shareTime: +new Date(),
      createUser: "",
      path: ""
    };

    var user = firebase.auth().currentUser;
    data.createUser = user.displayName;
    data.path = "users/" + user.uid + "/projects/" + data.id; //+ this.projectId

    var shareEmails = this.state.shareEmails;
    shareEmails.split(/[,|\n]/).forEach(function(email) {
      Firestore.getUsersByEmail(email.trim())
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            Firestore.shareProject(doc.id, data).then(() => {
            }).catch(error => {
              console.error("Project share failure, " + error);
            });
          });
        }).catch(function(error) {
          console.log("Error getting documents, " + error);
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
    const { tags, suggestions } = this.state;
    return (
      <ButtonToolbar>
        <Button color="primary" onClick={() => this.toggleSharePopup()}>
          Share
        </Button>
        <Modal
          onHide={() => this.toggleSharePopup()}
          show={this.state.shareModalShow}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          style={{ zIndex: 9999 }}
        >
          <Modal.Header closeButton>
            <Modal.Title id="share-project">Share Project</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="inputTitle">
                Who do you want to share this project with?
              </div>

                <Chips
                  value={this.state.tags}
                  onChange={this.onChange}
                  suggestions={this.state.suggestions}
                />

              {/* <div className="inputEmail">
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
                            </div> */}
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              color="primary"
              // style={{
              //     backgroundColor: "#FA8231",
              //     color: "#fff",
              //     borderRadius: 11,
              //     marginRight: "5%",
              //     width: "10%",
              //     boxShadow: "0px 2px 10px -4px rgba(0,0,0,0.5)",
              //     border: "none",
              //     fontFamily: "Montserrat",
              //     height: 35,
              //     fontWeight: "600"
              // }}
              disabled={this.state.shareEmails.length == 0}
              onClick={() => {
                this.shareProject();
              }}
            >
              Share
            </Button>
          </Modal.Footer>
        </Modal>
      </ButtonToolbar>
    );
  }
}

export default ShareProjectPopup;
