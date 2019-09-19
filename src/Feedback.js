import React from "react";
import { app } from "./Firebase";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Icon } from "antd";
import { Container, Navbar, Nav, Row, Col, Image } from "react-bootstrap";
import history from "./history";
import HeaderBar from "./HeaderBar.js"
import Ionicon from "react-ionicons";
import "./index.css";

const Feedback = ({ history }) => {
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
        <Container
          className="d-flex align-items-center"
          style={{ marginTop: "20vh", flexDirection: 'column' }}
        >
          <Row></Row>
          <Row className="justify-content-md-center">
            <Image
              src={require("../assets/images/feedback.svg")}
              style={{ height: 220 }}
            />
          </Row>
          <Row className="justify-content-md-center">
            <h1
              style={{
                textAlign: "center",
                color: "#3A4A56",
                fontFamily: "Montserrat",
                fontWeight: "700",
                textAlign: "center",
                fontSize: 30
              }}
            >
              No Feedback
            </h1>
          </Row>
          <Row className="justify-content-md-center">
            <h2
              style={{
                textAlign: "center",
                color: "#8fa5b5",
                fontFamily: "Montserrat",
                fontWeight: "600",
                textAlign: "center",
                fontSize: 15
              }}
            >
              <br />
              <br />
              When feedback is given, you will see it here!
            </h2>
          </Row>
        </Container>
      
      </Container>
    </React.Fragment>
  );
};

export default Feedback;
