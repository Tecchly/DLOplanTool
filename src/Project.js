import React from "react";
import { app } from "./Firebase";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Icon } from "antd";
import { withRouter, Redirect } from "react-router";
import { Container, Navbar, Nav, Row, Col, Image } from "react-bootstrap";
import HeaderBar from "./HeaderBar.js";
import "./index.css";
import IdeaCard from "./IdeaCard.js";
import { maxWidth } from "@material-ui/system";
import Utils from "./Utils";
import firebase from "firebase";
import Firestore from "./Firestore.js";

/** Note When pushing props to enter this component, need to push
 * projectID
 * title
 * subtitle
 * medium
 */
class Project extends React.Component {
  constructor(props) {
    super(props);
    //@@TODO find a good point to put saving.
  }

  //Onload, load the idea object as a prop to all children.
  state = {
    title: "",
    topic: "",
    medium: "",
    availableModes: ["video", "sound", "writing", "image"],
    loaded: false,
    ideas: {}
  };

  //Get changes from components,
  handleIdeaUpdate = (uuid, data) => {
    if (uuid === "root") {
      this.setState({ topic: data.title });
      //Change field in DB too.
    }
    this.setState(
      {
        ideas: {
          ...this.state.ideas,
          [`${uuid}`]: data
        }
      },
      () => {
        //@@Test for saving point. Make cleaner later
        var uid = firebase.auth().currentUser.uid;

        for (let idea in this.state.ideas) {
          //Saving of all ideas.
          Firestore.saveSingleIdeaToProject(
            uid,
            this.props.location.state.projectID,
            idea,
            this.state.ideas[idea]
          );
        }
      }
    );
  };

  handleIdeaDeletion = uuid => {
    const recursiveDelete = uuid => {
      for (let idea in this.state.ideas) {
        if (this.state.ideas[idea].parentID == uuid) {
          recursiveDelete(idea);
        }
      }
      console.log("Deleted: " + uuid);
      var replacement = this.state.ideas;
      delete replacement[uuid];
      this.setState({
        ideas: replacement
      });
      var uid = firebase.auth().currentUser.uid;
      Firestore.deleteIdeafromProject(
        uid,
        this.props.location.state.projectID,
        uuid
      );
    };
    recursiveDelete(uuid);
    console.log(this.state.ideas);
  };

  handleMainTopicChange = newTopic => {
    this.setState({ topic: newTopic }, function() {
      var data = {
        subtitle: newTopic
      };
      var uid = firebase.auth().currentUser.uid;
      Firestore.editProjectFields(
        uid,
        this.props.location.state.projectID,
        data
      );
    });
  };

  //Use only when loading ideas from DB.
  addIdea = x => {
    var data = x.data();
    //Flag to signify data added was from DB and not added by user, used to prevent default popup in ideaCard.
    data.fromLoad = true;
    this.setState({
      ideas: {
        ...this.state.ideas,
        [`${x.id}`]: data
      }
    });
  };

  componentDidMount() {
    this.setState({
      ideas: {
        ...this.state.ideas,
        root: {
          title: this.props.location.state.topic,
          parentID: "none",
          mode: this.props.location.state.medium, //Get from a prop
          notes: ""
        }
      }
    });

    if (this.props.location.state.medium == "Presentation") {
      this.setState({availableModes:["video", "sound", "writing", "image"]});
    } else if (this.props.location.state.medium == "Screencast") {
      this.setState({availableModes:["video", "sound", "writing", "image"]});
    } else if (this.props.location.state.medium == "Animation") {
      this.setState({availableModes:["sound", "writing", "image"]});
    } else if (this.props.location.state.medium == "Podcast") {
      this.setState({availableModes:["sound"]});
    } else if (this.props.location.state.medium == "Film") {
      this.setState({availableModes:["video", "sound", "writing", "image"]});
    } else if (this.props.location.state.medium == "Other") {
      this.setState({availableModes:["video", "sound", "writing", "image"]});
    }

    //this.props.location.state.projectID; Get project id.
    var ideas = Firestore.getAllIdeasByProject(
      firebase.auth().currentUser.uid,
      this.props.location.state.projectID
    );
    ideas
      .get()
      .then(
        function(idea) {
          idea.forEach(x => {
            this.addIdea(x);
          });
        }.bind(this)
      )
      .then(
        function() {
          this.setState({ loaded: true });
        }.bind(this)
      );

    if (this.props.location.state.title) {
      this.setState({ title: this.props.location.state.title });
    }

    if (this.props.location.state.topic) {
      this.setState({ topic: this.props.location.state.topic });
    }

    //@@TODO Medium select to control the available modes.
    if (this.props.location.state.medium) {
      this.setState({ medium: this.props.location.state.medium });
    }
  }

  componentWillUnmount() {}

  render() {
    return (
      <React.Fragment>
        <HeaderBar />
        <Container fluid={true}>
          <Row
            style={{ textAlign: "center", marginTop: 40, position: "relative" }}
          >
            <div style={{ display: "flex", position: "absolute", left: 100 }}>
              <Icon
                type="arrow-left"
                onClick={() => {
                  const { history } = this.props;
                  history.goBack();
                }}
                style={{
                  fontSize: 30,
                  color: "#2F4858",
                  cursor: "pointer"
                }}
              />
              <h3
                style={{
                  color: "#2F4858",
                  fontFamily: "Montserrat",
                  fontWeight: "700"
                }}
              >
                Back
              </h3>
            </div>

            <div style={{ display: "flex", position: "absolute", right: 150 }}>
              <h3
                style={{
                  color: "#2F4858",
                  fontFamily: "Montserrat",
                  fontWeight: "700"
                }}
              >
                Amplify
              </h3>
              <Icon
                type="arrow-right"
                onClick={() => {
                    const { history } = this.props;
                    history.push({
                        pathname: "./Amplification",
                        state: this.props.location.state
                        }
                    )
                }}
                style={{
                  fontSize: 30,
                  color: "#2F4858",
                  cursor: "pointer"
                }}
              />
            </div>
          </Row>
          <h1
            style={{
              textAlign: "center",
              font: "Montserrat,sans-serif",
              fontWeight: "700",
              color: "#2F4858"
            }}
          >
            {this.state.title}
          </h1>
          <div
            style={{ marginLeft: "15%", marginRight: "15%", maxWidth: "70%" }}
          >
            {this.state.loaded ? (
              <IdeaCard
                handleIdeaUpdate={this.handleIdeaUpdate}
                handleIdeaDeletion={this.handleIdeaDeletion}
                handleMainTopicChange={this.handleMainTopicChange}
                uuid="root"
                parentID="none"
                topic={this.state.topic}
                ideas={this.state.ideas}
                availableModes={this.state.availableModes}
              />
            ) : null}
          </div>
        </Container>
      </React.Fragment>
    );
  }
}

export default withRouter(Project);
