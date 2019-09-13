import React from "react";
import { app } from "./Firebase";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Icon } from "antd";
import { withRouter, Redirect } from "react-router";
import { Container, Navbar, Nav, Row, Col, Image } from "react-bootstrap";
import HeaderBar from "./HeaderBar.js"

class Project extends React.Component {
    constructor(props) {
        super(props);
        
        
    }

    componentDidMount() {

    }


    state = {
        
    };
    render() {
        return(
            <React.Fragment>
                <HeaderBar/>
                {this.props.location.state.title}
                <br/>
                {this.props.location.state.topic}
                <br/>
                <img src={this.props.location.state.image}/>
            </React.Fragment>          
        );
    }
}

export default withRouter(Project);