import React from "react";
import { app } from "./Firebase";
import "./index.css";
import { Button, Icon } from "antd";
import DragAndDrop from "./DragAndDrop.js";
import { withRouter, Redirect } from "react-router";
import firebase from "firebase";
import Firestore from "./Firestore.js";
import Ionicon from "react-ionicons";
import Utils from "./Utils.js";

//@@TODO, need to add a medium selector here.
import MessagePopup from "./MessagePopup.js";

class NewProjectPopup extends React.Component {
  constructor(props) {
    super(props);

    this.localCache = window.localStorage;

    this.isProjectCreated = false;

  }

  state = {
    showMessagePopup : false,
    projectTitle: "",
    projectTopic: "",
    imageName: "", //The ID of the image, whether from DB or upload
    image: "", //represents the source information about the image.
    file: "" //the uploaded file for the image.
  };

  toggleMessagePopup() {
    this.setState({showMessagePopup: !this.state.showMessagePopup});
  }

  componentDidMount() {
    //Local storage variant
    var title = this.localCache.getItem("title");
    if (title) {
      this.setState({ projectTitle: title });
    }

    var topic = this.localCache.getItem("topic");
    if (topic) {
      this.setState({ projectTopic: topic });
    }

    var image = this.localCache.getItem("image");
    if (image) {
      this.setState({ image: image });
    }

    var imageName = this.localCache.getItem("imageName");
    if (imageName) {
      this.setState({ imageName: imageName });
    }
  }

  componentWillUnmount() {
    //If a project is made, the local cache empties
    if (this.isProjectCreated) {
      this.localCache.removeItem("title");
      this.localCache.removeItem("topic");
      this.localCache.removeItem("image");
      this.localCache.removeItem("imageName");
    }
  }

  /**
   * Function to handle when a file is dropped into the drag and drop area.
   */
  handleDrop = fileList => {
    //If what was dragged in was not a image.
    if (!fileList[0] || fileList[0]["type"].split("/")[0] !== "image") {
      return;
    }

    var file = fileList[0];
    if (file) {
      var size = file.size;
      if (size > 5120000) {
        this.toggleMessagePopup();
        return;
      }
      this.setState({file:file});

      var uniqueName = Utils.uuid();      
      this.setState({imageName:uniqueName});
      this.localCache.setItem("imageName", uniqueName);

      var reader = new FileReader();
      reader.onload = function(e) {
        try {
          this.localCache.setItem("image", e.target.result);
        } catch (e) {
          //Image exceeds local storage.
        }
        this.setState({ image: e.target.result });
      }.bind(this);
      reader.readAsDataURL(file);
    }
  };

  /**
   * Uploads an image to firestore
   * @param {File} file: File to be uploaded to firebase.
   */
  uploadImage(file) {
    if (!file) {
      return;
    }

    //Uploading image    
    var storageRef = firebase.storage().ref("projectImage/" + this.state.imageName);          
    var uploadTask = storageRef.put(file);

    uploadTask.on(
      "state_changed",
      function error(err) {},
      function complete() {
        console.log("successful upload");
      }
    );
  }

  handleTitleChange =(event)=> {
    this.setState({ projectTitle: event.target.value }, function() {
      //Local cache variant
      this.localCache.setItem("title", this.state.projectTitle);
    });
  }

  handleTopicChange = (event) => {
    this.setState({ projectTopic: event.target.value }, function() {
      this.localCache.setItem("topic", this.state.projectTopic);
    });
  }

  makeProject() {
    //Make upload image here too.
    this.isProjectCreated = true;

    var data = {
      title: this.state.projectTitle,
      subtitle: this.state.projectTopic,
      image: "marae.jpg", //Default image.
      creationTime: + new Date()
    };

    if (this.state.imageName) {
      data.image = this.state.imageName;
    }

    if (this.state.file) {
      this.uploadImage(this.state.file);
    }

    const { history } = this.props;
    var uid = firebase.auth().currentUser.uid;
    Firestore.saveNewProject(uid, data).then(function(docRef){
     
      history.push({
        pathname: "./project",
        state: {
          projectID: docRef.id,
          title: this.state.projectTitle,
          topic: this.state.projectTopic,
          image: this.state.image,
          creationTime: +new Date()
        }
      })
    }.bind(this));
  }


  render() {
    var togglePopup = this.props.togglePopup;
    return (
      <React.Fragment>
        <div className="popup">
          <div className="inner">
          {this.state.showMessagePopup ?
          <MessagePopup 
            text='Images have to be 5MB or smaller. Please upload an image with a smaller file size.'
            closeMessagePopup={this.toggleMessagePopup.bind(this)} />
          : null}
            <Ionicon
              style={{
                position: "absolute",
                right: "15px",
                top: "15px",
                cursor: 'pointer',
              }}
              icon="md-close"
              onClick={() => togglePopup()}
            />

            <h1 className="newProjectTitle">New Project</h1>
            <div
              style={{
                marginLeft: "25%",
                marginRight: "25%"
              }}
            >
              <form>
                <div className="inputTitle">Project Title</div>
                <input
                  type="text"
                  className="textInput"
                  value={this.state.projectTitle}
                  onChange={this.handleTitleChange}
                />
                <div className="inputTitle">Project Topic</div>
                <input
                  type="text"
                  className="textInput"
                  value={this.state.projectTopic}
                  onChange={this.handleTopicChange}
                />
              </form>
            </div>
            <div
            className='dropDiv'
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
                <DragAndDrop handleDrop={this.handleDrop}>
                  <Ionicon
                    style={{
                      position: "absolute",
                      right: "15px",
                      top: "15px",
                      cursor: 'pointer',
                    }}
                    icon="md-close"
                    onClick={() => {
                      //Remove image from dropdown
                      this.localCache.removeItem("image");
                      this.localCache.removeItem("imageName");
                      this.setState({ image: "" });
                      this.setState({ file: "" });
                      this.setState({ imageName: "" });
                    }}
                  />
                  <div className="draggedImage">
                    {this.state.image === "" && (
                      <b className="dragText" style={{ color: "#fff" }}>
                        Drag Image Here
                      </b>
                    )}
                    <img src={this.state.image} />
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      height: "4.5em",
                      width: "101%",
                      textAlign: "left",
                      backgroundColor: "#2C3539",
                      color: "#fff",
                      bottom: -10,
                      left: "-0.5%",
                      paddingLeft: 12,
                      paddingTop: 3,
                      borderBottomLeftRadius: 17,
                      borderBottomRightRadius: 17
                    }}
                  >
                    <b>{this.state.projectTitle}</b>
                    <br />
                    {this.state.projectTopic}
                  </div>
                </DragAndDrop>
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
                  onClick={() => this.makeProject()}
                  disabled={
                    this.state.projectTitle.length == 0 ||
                    this.state.projectTopic.length == 0
                  }
                >
                  Create
                </Button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(NewProjectPopup);
