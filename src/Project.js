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


class Project extends React.Component {
    
    constructor(props) {
        super(props);  
        //@@TODO check if the props have been passed, if not then get them from DB
        
    }

    state= {
        title:'',
        topic: '', 
        medium: '',
        projectID: '',
        availableModes: ["video","sound","writing","image"],
        ideas :{

        }
    }

    handleIdeaUpdate = (uuid,data) =>{
        //Update ideas object
    }

    componentDidMount() {

        if (this.props.location.state.projectID) {
            this.setState({projectID: this.props.location.state.projectID}); //ID of the project for saving. 
        }   
        
        if (this.props.location.state.title) {
        this.setState({title: this.props.location.state.title});
        }

        if (this.props.location.state.topic) {
            this.setState({topic: this.props.location.state.topic});
        }        

        //@@TODO Medium select to control the available modes. 
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
                        <IdeaCard id ="rootNode" handleIdeaUpdate = {this.handleIdeaUpdate} uuid = {Utils.uuid()} title={this.props.location.state.topic} availableModes={this.state.availableModes}/> 
                    </div>                       
            </React.Fragment>          
        );
    }
}

export default withRouter(Project);