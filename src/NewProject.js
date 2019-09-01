import React from 'react';  
import { app } from "./Firebase";
import "./index.css";
import { Button, Icon, AutoComplete } from "antd";
import DragAndDrop from "./DragAndDrop.js"

class NewProjectPopup extends React.Component {
    constructor(props) {
        super(props)
        
    }
    //@@TODO, fix the mix of inline and not inline css. v.dirty

    state = {
        projectTitle : "",
        projectTopic : "",
        Image : "",
    }
    handleDrop = (file) => {        
        var reader  = new FileReader();
        reader.onload = function(e)  {
            var image = document.createElement("img");
            image.src = e.target.result;
            var imagePane = document.getElementById("imagePane");
            imagePane.innerHTML = "";
            imagePane.appendChild(image);
         }
         reader.readAsDataURL(file[0]);
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
                                    <input type="text" className="textInput" title="name" />
                                    <div>Project Topic</div>
                                    <input type="text" className="textInput" topic="name" />
                                </form>
                        </div>
                        <div 
                            style = {{
                                marginLeft: "25%",
                                marginRight: "25%",
                                textAlign:"center"
                            }}>
                            <DragAndDrop handleDrop={this.handleDrop}>
                                <div id="imagePane">
                                    Drag Image here
                                </div>
                            </DragAndDrop>
                            <br/>
                            <Button>Create</Button>
                        </div>
                    </div>
                </div>

            </React.Fragment>      
        );
    }
}

export default NewProjectPopup