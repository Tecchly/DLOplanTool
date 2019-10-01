import firestore from "firebase/firestore";
import Firestore from "./Firestore.js";
import React from "react";
import { app } from "./Firebase";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Icon } from "antd";
import { Container, Navbar, Nav, Row, Col, Image } from "react-bootstrap";
import history from "./history";
import HeaderBar from "./HeaderBar.js"
import Ionicon from "react-ionicons";
import "./style.scss";
import FeedbackContent from './FeedbackContent';
import { withRouter } from 'react-router';

const Feedback = ({ history }) => {

  const loadProject = row => {
    var proj = row.project;
    history.push({
      pathname: "./project",
      state: {
        projectID: row.projectId,
        medium: proj.medium,
        title: proj.title,
        topic: proj.subtitle,
        image: proj.image,
    }});
  }
  

  return (
    <React.Fragment>
      <HeaderBar />
      <Container fluid={true}>
        <Container
          style={{ marginTop: 40, marginLeft: 100, marginRight: 100 }}
          fluid
        >
          <Row>
            <Icon
              type="arrow-left"
              onClick={() => history.push("/")}
              style={{
                fontSize: 30,
                marginRight: 10,
                color: "#2F4858",
                cursor: "pointer"
              }}
            />
            <h3
              style={{
                color: "#2F4858",
                fontFamily: "Montserrat",
                fontWeight: "700"
              }}
            >
              Feedback
            </h3>
          </Row>
        </Container>
        <FeedbackContent loadProject={loadProject}/>
      
      </Container>
    </React.Fragment>
  );
};

export default withRouter(Feedback);
