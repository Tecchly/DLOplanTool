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


class Project extends React.Component {
    
    constructor(props) {
        super(props);       

        //@@TODO check if the props have been passed, if not then get them from DB
        
    }

    componentDidMount() {
        
    }

    //Generate a uuid.
    uuidv4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        )
    }

    componentWillUnmount() {
        
    }

    state = {

    };
    render() {
        return(
            <React.Fragment>
                <HeaderBar/>
                    <div style={{marginLeft: "20%", marginRight: "20%", maxWidth: "60%"}}>
                        <IdeaCard id ="rootNode" data = {this.props}/> 
                    </div>                       
            </React.Fragment>          
        );
    }
}

export default withRouter(Project);