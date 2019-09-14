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

    componentDidMount() {
        
    }


    componentWillUnmount() {
        
    }

    state = {
        //Will change based off the medium chosen
        availableModes: ["video","sound","writing","image"]

    };
    render() {
        return(
            <React.Fragment>
                <HeaderBar/>
                    <div style={{marginLeft: "15%", marginRight: "15%", maxWidth: "70%"}}>
                        <IdeaCard id ="rootNode" uuid = {Utils.uuid()} availableModes={this.state.availableModes}/> 
                    </div>                       
            </React.Fragment>          
        );
    }
}

export default withRouter(Project);