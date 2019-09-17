import React from "react";
import { app } from "./Firebase";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Icon } from "antd";
import { withRouter, Redirect } from "react-router";
import { Container, Navbar, Nav, Row, Col, Image } from "react-bootstrap";
import HeaderBar from "./HeaderBar.js"
import "./index.css"
import IdeaCard from "./IdeaCard.js"
import { maxWidth } from "@material-ui/system";
import Utils from "./Utils";
import firebase from "firebase";
import Firestore from "./Firestore.js";


class Project extends React.Component {
    
    constructor(props) {
        super(props);  
        //@@TODO check if the props have been passed, if not then get them from DB
        
    }

    //Onload, load the idea object as a prop to all children. 
    state= {
        title:'',
        topic: '', 
        medium: '',
        projectID: '',
        availableModes: ["video","sound","writing","image"],
        ideas :{

        }
    }

    //Get changes from components.
    handleIdeaUpdate = (uuid,data) =>{
        this.setState({
            ideas: {
                  ...this.state.ideas,
                  [`${uuid}`]: data
            }
        }, ()=> {                        
            var uid = firebase.auth().currentUser.uid;
            for (let idea in this.state.ideas) {
                //Saving of all ideas. 
                Firestore.saveIdeaToProject(uid,this.props.location.state.projectID,this.state.ideas[idea]);
            }
        })
    }

    componentDidMount() {

        //this.props.location.state.projectID; Get project id.

        if (this.props.location.state.title) {
        this.setState({title: this.props.location.state.title});
        }

        if (this.props.location.state.topic) {
            this.setState({topic: this.props.location.state.topic});
        }        

        //@@TODO Medium select to control the available modes. 
        
        //get all ideas from DB if opening a previously saved project. 
    }


    componentWillUnmount() {
        
    }

    render() {
        return(
            <React.Fragment>
                <HeaderBar/>
                    <h1 style ={{
                        textAlign: "center"
                    }}
                    >
                        {this.state.title}
                    </h1>
                    <div style={{marginLeft: "15%", marginRight: "15%", maxWidth: "70%"}}>
                        <IdeaCard 
                            handleIdeaUpdate = {this.handleIdeaUpdate}
                            uuid = "root"
                            parentID = "none"
                            title={this.props.location.state.topic}
                            availableModes={this.state.availableModes}/> 
                    </div>                       
            </React.Fragment>          
        );
    }
}

export default withRouter(Project);