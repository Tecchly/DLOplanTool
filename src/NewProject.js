import React from "react";
import { app } from "./Firebase";
import "./index.css";
import { Button, Icon } from "antd";
import DragAndDrop from "./DragAndDrop.js";
import { withRouter, Redirect } from "react-router";

class NewProjectPopup extends React.Component {
  constructor(props) {
    super(props);

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

  handleDrop = file => {
    //If what was dragged in was not a image.
    if (!file[0] || file[0]["type"].split("/")[0] !== "image") {
      return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
      var image = document.createElement("img");
      image.src = e.target.result;
      var imagePane = document.getElementById("imagePane");
      imagePane.innerHTML = "";
      imagePane.appendChild(image);
      this.setState({ image: image.src });
    }.bind(this);
    reader.readAsDataURL(file[0]);
  };

  //@@TODO more general method needed
  handleTitleChange(event) {
    this.setState({ projectTitle: event.target.value });
  }

  handleTopicChange(event) {
    this.setState({ projectTopic: event.target.value });
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
                marginTop: "15%",
                marginLeft: "25%",
                marginRight: "25%",
                textAlign: "center"
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
                    var imagePane = document.getElementById("imagePane");
                    imagePane.innerHTML = "Drag image here";
                    this.setState({ image: "" });
                  }}
                />
                <div id="imagePane">Drag image here</div>
                <div
                  style={{
                    position: "absolute",
                    height: "3em",
                    width: "101%",
                    textAlign: "left",
                    backgroundColor: "#2C3539",
                    color: "#fff",
                    bottom: -5,
                    left: "-0.5%"
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
                  marginTop: "10%"
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
      </React.Fragment>
    );
  }
}

export default withRouter(NewProjectPopup);
