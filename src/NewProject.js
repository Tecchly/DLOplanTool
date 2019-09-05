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

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleTopicChange = this.handleTopicChange.bind(this);

    this.isProjectCreated = false;
  }

  state = {
    projectTitle: "",
    projectTopic: "",
    imageName: "", //The name of the image, whether from DB or upload
    image: "", //represents the source information about the image.
    file:"" //the uploaded file for the image.
  };

  componentDidMount() {

    var uid = firebase.auth().currentUser.uid;
    Firestore.getUserData(uid).get().then(function(doc){
      if (doc) {
        var fields = doc.data();
        this.setState({projectTitle:fields.title});
        this.setState({projectTopic:fields.subtitle});

        var imageName =fields.image;
        if (imageName) {
          try {
            var storage = firebase.storage();
            storage.ref("projectImage/" + imageName).getDownloadURL()
              .then(function(url) {
                this.setState({image:url});
                this.setState({imageName:imageName});
              }.bind(this));      
          } catch(e) {
            //Bad image load
            this.state.image = "";
          }
        }
        
      }
    }.bind(this));
  }

  componentWillUnmount() {
    //purge interim database if the project is created.
    var data = {
      title:  "",
      subtitle: "",
      file: ""
    }

    if (!this.isProjectCreated){
      data.title=this.state.projectTitle;
      data.subtitle = this.state.projectTopic;

      if (this.state.imageName) {
        data.file = this.state.imageName;
      }
    } 

    //If the project is created the fields will default to empty.
    console.log(data);
    var uid = firebase.auth().currentUser.uid;
    Firestore.saveWithDocID("users",uid,{
      "title": data.title,
      "subtitle" : data.subtitle,
      "image" : data.file
    });

    if (this.state.file){
      this.uploadImage(this.state.file);
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
      this.setState({imageName:file.name});
  
      var reader = new FileReader();
      reader.onload = function(e) {      
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
    var storageRef = firebase.storage().ref("projectImage/" + file.name);          
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
    this.setState({ projectTitle: event.target.value });
    
  }

  handleTopicChange(event) {
    this.setState({ projectTopic: event.target.value });
  }

  makeProject() {
    this.isProjectCreated = true;
    const { history } = this.props;
    history.push({
      pathname: "./project",
      state: {
        title: this.state.projectTitle,
        topic: this.state.projectTopic,
        image: this.state.image
      }
    });    
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
                      //Could remove image from db too?
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
