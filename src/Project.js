import React from "react";
import { app } from "./Firebase";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Icon } from "antd";
import { withRouter, Redirect } from "react-router";
import { Container, Navbar, Nav, Row, Col, Image } from "react-bootstrap";
import HeaderBar from "./HeaderBar.js"
import ShareProjectPopup from "./ShareProjectPopup";

class Project extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = { showPopup: false };
    }

    togglePopup() {
        this.setState({
            showPopup: !this.state.showPopup
        });
    }

    render() {
        return (
            <React.Fragment>
                <HeaderBar />
                {this.props.location.state.title}
                <br />
                {this.props.location.state.topic}
                <br />
                <img src={this.props.location.state.image} />
                <br />
                <button style={{
                    backgroundColor: "#FA8231",
                    color: "#fff",
                    marginTop: "5%",
                    borderRadius: 11,
                    width: "50%",
                    boxShadow: "0px 2px 10px -4px rgba(0,0,0,0.5)",
                    border: "none",
                    fontFamily: "Montserrat",
                    height: 45,
                    fontWeight: "600"
                }}
                    onClick={this.togglePopup.bind(this)}> Share Project</button>
                <div>
                    {this.state.showPopup ?
                        <ShareProjectPopup
                            closePopup={this.togglePopup.bind(this)}
                        />
                        : null
                    }
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(Project);