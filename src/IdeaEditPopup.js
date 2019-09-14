import React from "react";
import { app } from "./Firebase";
import { Button, Icon } from "antd";
import firebase from "firebase";
import Firestore from "./Firestore.js";
import Ionicon from "react-ionicons";
import Utils from "./Utils.js";
import "./index.css";

class IdeaEditPopup extends React.Component {
    constructor(props) {
        super(props);

    }

    state = {
        title:'',
        mode:'',
        notes:''
    }

    componentDidMount(){
        if (this.props.title) {
            this.setState({"title":this.props.title});
        }

        if (this.props.mode) {
            this.setState({"mode":this.props.mode});
        }

        if  (this.props.notes) {
            this.setState({"notes":this.props.notes});
        }
    }

    handleTitleChange = (event)=> {
        this.setState({title: event.target.value});
    }

    handleNotesChange = (event)=> {
        this.setState({notes: event.target.value});
    }

    render(){
        return(
            <React.Fragment>
            <div className="popup">
                <div className="inner">
                    <div className = {this.state.mode}>
                        <h2>{this.state.mode}</h2>
                    </div>
                    <input 
                        type="text"
                        className = "textInput heading"
                        value={this.state.title} 
                        onChange={this.handleTitleChange} 
                        />
                        
                    <textarea 
                        value={this.state.notes} 
                        onChange={this.handleNotesChange}
                        />
                    <div
                    style={{marginLeft:"auto", marginRight:"auto",display:"flex", flexDirection:"column",width:"30%"}}>
                        <button
                            className= "selectButton"
                            onClick ={()=>{
                                this.props.handleEdit(this.state.title,this.state.notes);
                                this.props.closePopup();
                            }}>
                            Done
                        </button>
                        <button
                            className= "selectButton"
                            onClick ={()=>{
                                this.props.closePopup();
                            }}                 
                        >Cancel
                        </button>
                    </div>

                    </div>
                </div>
            </React.Fragment>
        )
    }

}
export default IdeaEditPopup