import React from "react";
import { app } from "./Firebase";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Icon } from "antd";
import { withRouter, Redirect } from "react-router";
import { Container, Navbar, Nav, Row, Col, Image } from "react-bootstrap";
import HeaderBar from "./HeaderBar.js";
import "./style.scss";
import IdeaCard from "./IdeaCard.js";
import { maxWidth } from "@material-ui/system";
import Utils from "./Utils";
import firebase from "firebase";
import Firestore from "./Firestore.js";
import ShareProjectPopup from "./ShareProjectPopup";

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
       
        var uid = firebase.auth().currentUser.uid;

        for (let idea in this.state.ideas) {
          //Saving of all ideas.
          Firestore.saveIdea(
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
      let user = firebase.auth().currentUser;
      if (user) {
        Firestore.deleteIdea(
          user.uid,
          this.props.location.state.projectID,
          uuid
        ).then(() => {
        }).catch(error => {
          console.error("Idea deletion failure, " + error);
        });
      } else {
        console.error("Not authenticated.");
      }
    };
    recursiveDelete(uuid);
    console.log(this.state.ideas);
  };

  //Handle the root node changing, may be deprecated
  handleMainTopicChange = newTopic => {
    this.setState({ topic: newTopic }, function() {
      var data = {
        subtitle: newTopic
      };
      var uid = firebase.auth().currentUser.uid;
      Firestore.editProject(
        uid,
        this.props.location.state.projectID,
        data
      ).then(() => {
      }).catch(error => {
        console.error("Edit project failure, " + error);
      });
    });
  };

  /**
   * @params:uuid, uuid of the idea with which the commendation being sent,
   * commend: type of commend being sent through
   */
  
  handleCommend = (ideaID,commend) => {
    var ownerID = firebase.auth().currentUser.uid; 
    if (this.props.location.state.shared){
      var ownerID = this.props.location.state.path.split("/")[1];     
    }
    
    Firestore.saveCommendation(
        ownerID,
        this.props.location.state.projectID,
        ideaID,
        firebase.auth().currentUser.uid,
        commend
    ).then(() => {
    }).catch(error => {
       console.error("Commendation save failure, " + error);
    });
  }

  loadCommendations = (ideaID) => {
    var commendations = [];

    var ownerID = firebase.auth().currentUser.uid; 
    if (this.props.location.state.shared){
      var ownerID = this.props.location.state.path.split("/")[1];     
    }
    
    var ideaQuery = Firestore.getCommendations(
      ownerID,
      this.props.location.state.projectID,
      ideaID,
    );

    return ideaQuery;
  }



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
        // ...this.state.ideas,
        root: {
          title: this.props.location.state.topic,
          parentID: "none",
          mode: this.props.location.state.medium, //Get from a prop
          notes: ""
        }
      }
    });

    

    if (this.props.location.state.medium == "Presentation") {
      this.state.availableModes = ["video", "sound", "writing", "image"];
    } else if (this.props.location.state.medium == "Screencast") {
      this.state.availableModes = ["video", "sound", "writing", "image"];
    } else if (this.props.location.state.medium == "Animation") {
      this.state.availableModes = ["video", "sound", "writing", "image"];
    } else if (this.props.location.state.medium == "Video") {
      this.state.availableModes = ["sound", "writing", "image"];
    } else if (this.props.location.state.medium == "Podcast") {
      this.state.availableModes = ["sound"];
    } else if (this.props.location.state.medium == "Film") {
      this.state.availableModes = ["video", "sound"];
    }

    //Change the uid if the project is shared
    var uid = firebase.auth().currentUser.uid; 
    if (this.props.location.state.shared){
      var uid = this.props.location.state.path.split("/")[1];     
    }

    //Load the ideas from the database
    Firestore.getIdeas(
      uid,
      this.props.location.state.projectID
    ).then(
      function(idea) {
        idea.forEach(x => {
          this.addIdea(x);
        });
      }.bind(this)
    ).then(
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

    if (this.props.location.state.medium) {
      this.setState({ medium: this.props.location.state.medium });
    }
  }

  componentWillUnmount() {
    var localCache = window.localStorage;
    if(localCache.getItem("showProjectTour")) {
      localCache.removeItem("showProjectTour");
      console.log("remove local cache showProjectTour");
    }
    if (this.props.location.state.shared && localCache.getItem("showSharedProjectsTour")) {
      localCache.removeItem("showSharedProjectsTour");
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.location.state.projectID !== this.props.location.state.projectID) {
      this.setState({
        title: "",
        topic: "",
        medium: "",
        availableModes: ["video", "sound", "writing", "image"],
        loaded: false,
        ideas: {}
      });
      this.componentDidMount();
    }
  }

  render() {
    return (
      <React.Fragment>
        <HeaderBar steps={steps}/>
        <Container fluid={true}>
          <Row
            style={{ textAlign: "center", marginTop: 40, position: "relative" }}
          >
            <div style={{ display: "flex", position: "absolute", left: 100 }} guide="goBack">
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
            {this.props.location.state.shared ? null : (
            <div style={{ display: "flex", position: "absolute", right: 150 }} guide="goToAmplify">
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
            </div>)}
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
            guide="rootIdea"
          >
            {this.state.loaded ? (
              <IdeaCard
                handleIdeaUpdate={this.handleIdeaUpdate}
                handleIdeaDeletion={this.handleIdeaDeletion}
                handleMainTopicChange={this.handleMainTopicChange}
                handleCommend={this.handleCommend}
                loadCommendations = {this.loadCommendations}
                uuid="root"
                parentID="none"
                topic={this.state.topic}
                ideas={this.state.ideas}
                availableModes={this.state.availableModes}
                shared={this.props.location.state.shared}
              />
            ) : null}
          </div>
        </Container>
        {/* <ShareProjectPopup style={{
                        backgroundColor: "#FA8231",
                        color: "#fff",
                        marginTop: "30%",
                        borderRadius: 11,
                        marginLeft: "90%",
                        width: "5%",
                        minWidth: 90,
                        boxShadow: "0px 2px 10px -4px rgba(0,0,0,0.5)",
                        border: "none",
                        fontFamily: "Montserrat",
                        height: 45,
                        minHeight: 45,
                        fontWeight: "600"
                }}
                    title={this.state.title} subtitle={this.state.topic} image={this.props.location.state.image} projectId={this.props.location.state.projectID} /> */}
      </React.Fragment>
    );
  }
}

const steps = [
  {
    selector: '[guide="rootIdea"]',
    content: (<h5>this is the root idea node of your project!</h5>),
    action: node => {
      var localCache = window.localStorage;
      if(localCache.getItem("showProjectTour")) {
        localCache.removeItem("showProjectTour");
        console.log("remove local cache showProjectTour");
      }
      // if (this.props.location.state.shared && localCache.getItem("showSharedProjectsTour")) {
      //   localCache.removeItem("showSharedProjectsTour");
      // }
    }
  },
  {
    selector: '.addSubIdeasButton',
    content: (<h5>click here to map your first sub idea of this project!</h5>)
  },
  {
    selector: '[guide="chooseModeType"]',
    content: (<h5>choose the mode type of this idea here!</h5>),
    action: node => {
      try {
        node.focus();
      } catch (e) {
        console.log(e)
      }
    }
  },
  {
    selector: '[guide="inputIdeaTitle"]',
    content: (<h6>give a title of your idea here!</h6>),
    action: node => {
      try {
        node.focus();
      } catch (e) {
        console.log(e)
      }
      // node.value="Rain";
    }
  },
  {
    selector: '[guide="inputIdeaNotes"]',
    content: (<h6>add more detailed informations for this idea here!</h6>),
    action: node => {
      try {
        node.focus();
      } catch (e) {
        console.log(e)
      }
      // node.value="rain is a type of water falls from sky";
    }
  },
  {
    selector: '[guide="feedbackbar"]',
    content: (<h6>Your friend can commend your ideas if you share this project with them, after they commended, you can find them here!</h6>)
  },
  {
    selector: '[guide="doneButton"]',
    content: (<h6>click here to finish editing this idea!</h6>)
  },
  {
    selector: '[guide="goBack"]',
    content: (<h6>You may add more ideas later, but now lets click here and go back to the home page!</h6>),
    action: node => {
      window.localStorage.setItem("showOtherGuide", true);
    }
  }
];

export default withRouter(Project);
