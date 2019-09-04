import React from "react";
import { app } from "./Firebase";
import "./index.css";
import { Button, Icon } from "antd";
import DragAndDrop from "./DragAndDrop.js";
import { withRouter, Redirect } from "react-router";

class NewProjectPopup extends React.Component {
  constructor(props) {
    super(props);
    //Mock DB with local storage
    this.database = window.localStorage;

    var title = this.database.getItem("DLOtitle");
 
    if (title){
      this.state.projectTitle = title
    }

    var topic = this.database.getItem("DLOtopic");
    if (topic){
      this.state.projectTopic = topic;
    }

    //Issue with image upload being it can get real expensive, probably have to have a loading animation 
    var image = this.database.getItem("DLOimage");
    if (image) {
      this.state.image = image;
    }

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleTopicChange = this.handleTopicChange.bind(this);
    this.history = history;
  }

  //@@TODO, fix the mix of inline and not inline css. v.dirty
  state = {
    projectTitle: "",
    projectTopic: "",
    image: ""
  };

  //@@TODO, need to have a limit on file size
  handleDrop = file => {
    //If what was dragged in was not a image.
    if (!file[0] || file[0]["type"].split("/")[0] !== "image") {
      return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {      
      this.setState({ image: e.target.result }, function() {
        try {
          this.database.setItem("DLOimage",e.target.result);
        } catch(e) {
          console.log("File too big");
        }        
      });
    }.bind(this);
    reader.readAsDataURL(file[0]);
  };

  //@@TODO more general method needed
  handleTitleChange(event) {
    //Yeah this is gonna cause some perfomrance issues I can feel it in my bones.
    //More of a trial of one way this could be done.
    this.setState({ projectTitle: event.target.value }, function() {
      this.database.setItem("DLOtitle",this.state.projectTitle);
    });
    
  }

  handleTopicChange(event) {
    this.setState({ projectTopic: event.target.value }, function() {
      this.database.setItem("DLOtopic",this.state.projectTopic);
    });
  }

  makeProject() {
    //@@TODO make this actually redirect
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
                      this.setState({ image: "" },this.database.setItem("DLOimage",""));
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
                  onClick={() => function() {
                    this.makeProject();
                    //also clear the interim from database
                    this.database.removeItem("DLOtitle");
                    this.database.removeItem("DLOtopic");
                    this.database.removeItem("DLOimage");
                  }}
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
