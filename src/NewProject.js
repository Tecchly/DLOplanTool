import React from 'react';  
import { app } from "./Firebase";
import "./index.css";
import { Button, Icon, AutoComplete } from "antd";
import DragAndDrop from "./DragAndDrop.js"

class NewProjectPopup extends React.Component {
    constructor(props) {
        super(props)

        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleTopicChange = this.handleTopicChange.bind(this);
        
    }
    //@@TODO, fix the mix of inline and not inline css. v.dirty
    //@@Pass in the state as props to the next component
    state = {
        projectTitle : "",
        projectTopic : "",
        image : "",
    }

    handleDrop = (file) => {        
        var reader  = new FileReader();
        reader.onload = function(e)  {
            var image = document.createElement("img");
            image.src = e.target.result;
            var imagePane = document.getElementById("imagePane");
            imagePane.innerHTML = "";
            imagePane.appendChild(image);
            this.setState({image:image.src});
         }
         reader.readAsDataURL(file[0]);
    }

    handleTitleChange(event) {
        this.setState({projectTitle: event.target.value});
    }

    //@@TODO more general method needed
    handleTopicChange(event) {
        this.setState({projectTopic: event.target.value});
    }
    

    render() {
        var togglePopup = this.props.togglePopup;
        return (
            <React.Fragment>
                <div className='popup'>
                    <div className='inner'>
                        <Icon 
                            style = {{
                                position:"absolute",
                                right: "15px",
                                top: "15px"
                            }}
                            type="close" 
                            onClick={() => 
                                togglePopup()
                            }
                        />        
                        <h1>
                            New Project                                
                        </h1>
                        <div
                            style ={{
                                marginLeft: "35%",
                                marginRight: "35%"
                            }}
                            >                   
                                <form>
                                    <div>Project Title</div>
                                    <input 
                                        type="text"
                                        className="textInput"
                                        value = {this.state.projectTitle}
                                        onChange = {this.handleTitleChange}
                                    />
                                    <div>Project Topic</div>
                                    <input 
                                        type="text"
                                        className="textInput"
                                        value = {this.state.projectTopic}
                                        onChange = {this.handleTopicChange}    
                                    />
                                </form>
                        </div>
                        <div 
                            style = {{
                                marginTop: "15%",
                                marginLeft: "25%",
                                marginRight: "25%",
                                textAlign:"center"
                            }}>

                            <DragAndDrop handleDrop={this.handleDrop}>
                                <div id="imagePane">
                                    Drag Image here
                                </div>
                                <div class= "projectDetails">
                                <b>
                                    {this.state.projectTitle}
                                </b>       
                                <br/>                             
                                    {this.state.projectTopic}
                                </div>
                            </DragAndDrop>
                            <br/>                                
                            <Button
                                style={{ 
                                    backgroundColor: "#FA8231", 
                                    color: "#fff",
                                    marginTop: "10%"
                                }}
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

export default NewProjectPopup