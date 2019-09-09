import React from "react";
import { app } from "./Firebase";
import "./index.css";
import { Button, Icon } from "antd";
import DragAndDrop from "./DragAndDrop.js";
import { withRouter, Redirect } from "react-router";
import firebase from "firebase"
import Firestore from "./Firestore.js"

class NewProjectPopup extends React.Component {
  constructor(props) {
    super(props);

    this.localCache = window.localStorage;

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleTopicChange = this.handleTopicChange.bind(this);

    this.isProjectCreated = false;
  }

  state = {
    projectTitle: "",
    projectTopic: "",
    imageName: "", //The ID of the image, whether from DB or upload
    image: "", //represents the source information about the image.
    file:"" //the uploaded file for the image.
  };

  componentDidMount() {

    //Local storage variant
    var title = this.localCache.getItem("title");
    if (title) {
      this.setState({projectTitle:title});
    }

    var topic = this.localCache.getItem("topic");
    if (topic) {
      this.setState({projectTopic:topic});
    }

    var image = this.localCache.getItem("image");
    if (image) {
      this.setState({image:image});
    }

    var imageName = this.localCache.getItem("imageName");
    if (imageName) {
      this.setState({imageName:imageName});
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
      this.setState({file:file});

      var uniqueName = this.uuidv4();      
      this.setState({imageName:uniqueName});
      this.localCache.setItem("imageName", uniqueName);

      var reader = new FileReader();
      reader.onload = function(e) {      
        try {
          this.localCache.setItem("image", e.target.result);
        } catch (e){
          //Image exceeds local storage.
        }
        this.setState({ image: e.target.result});
      }.bind(this);
      reader.readAsDataURL(file);
    } 
  }

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

    uploadTask.on('state_changed', 
          function error(err){

          },
          function complete(){
            console.log("successful upload");
          }
      );
  }


  handleTitleChange(event) {
    this.setState({ projectTitle: event.target.value },function()
    {
      //Local cache variant
      this.localCache.setItem("title",this.state.projectTitle);
    });
    
  }

  handleTopicChange(event) {
    this.setState({ projectTopic: event.target.value }, function()
    {
      this.localCache.setItem("topic",this.state.projectTopic);
    });
  }

  makeProject() {
    this.isProjectCreated = true;

    var data = {
      title:  this.state.projectTitle,
      subtitle: this.state.projectTopic,
      image: "",
      creationTime: + new Date()
    }

    if (this.state.imageName) {
      data.image = this.state.imageName;
    }

    var uid = firebase.auth().currentUser.uid;
    Firestore.saveNewProject(uid,data);
    if (this.state.file){
      this.uploadImage(this.state.file);
    } 

    const { history } = this.props;
    history.push({
      pathname: "./project",
      state: {
        title: this.state.projectTitle,
        topic: this.state.projectTopic,
        image: this.state.image,
        creationTime: + new Date()
      }
    });    
  }

  //Generate a uuid
  uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
  }
  

  render() {
    var togglePopup = this.props.togglePopup;
    const { history } = this.props;
    return (
      <React.Fragment>
        <div className="popup">
          <div className="inner">
            <Icon
              style={{
                position: "absolute",
                right: "15px",
                top: "15px"
              }}
              type="close"
              onClick={() => togglePopup()}
            />
            <h1>New Project</h1>
            <div
              style={{
                marginLeft: "35%",
                marginRight: "35%"
              }}
            >
              <form>
                <div>Project Title</div>
                <input
                  type="text"
                  className="textInput"
                  value={this.state.projectTitle}
                  onChange={this.handleTitleChange}
                />
                <div>Project Topic</div>
                <input
                  type="text"
                  className="textInput"
                  value={this.state.projectTopic}
                  onChange={this.handleTopicChange}
                />
              </form>
            </div>
            <div
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
                width: "50%",
              }}
              >              
                <DragAndDrop handleDrop={this.handleDrop}>
                  <Icon
                    style={{
                      position: "absolute",
                      right: "5px",
                      top: "5px"
                    }}
                    type="close"
                    onClick={() => {
                      //Remove image from dropdown
                      this.localCache.removeItem("image");
                      this.localCache.removeItem("imageName");
                      this.setState({ image: "" });
                      this.setState({file:""});
                      this.setState({imageName:""});
                    }}
                  />
                  <div className = "draggedImage">
                    {this.state.image === "" && <b>Drag Image Here</b>}
                    <img src = {this.state.image}/>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      height: "3em",
                      width: "101%",
                      textAlign: "left",
                      backgroundColor: "#2C3539",
                      color: "#fff",
                      bottom: -10,
                      left: "-0.5%",
                      paddingLeft: "0.5em"
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
                    marginTop: "5%"
                  }}
                  onClick={() => 
                    this.makeProject()
                  }
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
