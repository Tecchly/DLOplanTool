import React, { useEffect } from "react";
import { app } from "./Firebase";
import firebase from "firebase";
import Firestore from "./Firestore.js";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Icon } from "antd";
import { Container, Navbar, Nav, Row, Col, Image } from "react-bootstrap";
import history from "./history";
import Ionicon from "react-ionicons";
import "./index.css";
import NewProjectPopup from "./NewProject";
import { useState } from "react";
import AmplificationTile from "./AmplificationTile";
import Wave from "../assets/images/wave.png";
const useStyles = makeStyles(theme => ({
  button: {
    width: "100%",
    boxShadow: "0px 2px 10px -4px rgba(0,0,0,0.5)",

    border: "none",
    fontFamily: "Montserrat",
    borderRadius: 17,
    height: 50,
    fontWeight: "400"
  },
  leftIcon: {
    left: 0
  },
  recentProject: {
    width: "100vh",
    boxShadow: "0px 2px 10px -4px rgba(0,0,0,0.5)",
    backgroundColor: "#fff",
    border: "none",
    fontFamily: "Montserrat",
    borderRadius: 17,
    height: 400,
    fontWeight: "400",
    marginLeft: 10,
    marginRight: 10
  },
  title: {
    color: "#fff",
    fontFamily: "Montserrat",
    fontWeight: "700",
    fontSize: 20
  },
  subtitle: {
    color: "#fff",
    fontFamily: "Montserrat",
    fontWeight: "400",
    fontSize: 17
  },
  rightIcon: {
    marginLeft: theme.spacing(1)
  },
  iconSmall: {
    fontSize: 20
  },
  projectOverlay: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 17,
    cursor: "pointer"
  }
}));

const Amplification = ({ history }) => {
  const classes = useStyles();

  var storage = firebase.storage().ref();

  return (
    <React.Fragment>
      <div
        style={{
          width: "100%",
          height: 188,
          position: "absolute",
          backgroundImage: `url(${Wave})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom",
          backgroundSize: "cover"
        }}
      ></div>
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="light"
        variant="light"
        style={{
          backgroundColor: "transparent"
        }}
      >
        <Container
          fluid
          style={{
            alignSelf: "center",
            alignContent: "center",
            justifyContent: "center"
          }}
        >
          <Col />
          <Col
            className="justify-content-md-center"
            xs={11}
            style={{ textAlign: "center" }}
          >
            <Navbar.Brand
              style={{
                textAlign: "center",
                color: "#FFF",
                fontFamily: "Montserrat",
                fontWeight: "600",
                fontSize: 22,
                cursor: "pointer"
              }}
              onClick={() => {
                history.push("/");
              }}
            >
              <Image
                src={require("../assets/images/orange_logo_white.png")}
                style={{ height: 30, marginLeft: 5, marginBottom: 2 }}
              />
              Digital Learning
            </Navbar.Brand>
          </Col>
          <Col style={{}}>
            <Nav className="mr-auto"></Nav>
            <Nav>
              <img
                alt="profile"
                src={app.auth().currentUser.photoURL}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  cursor: "pointer"
                }}
                onClick={() => {
                  localStorage.setItem("user", null);
                  app.auth().signOut();
                  history.push("/login");
                }}
              />
            </Nav>
          </Col>
        </Container>
      </Navbar>
      <Container fluid={true}>
        <AmplificationTile icon='ios-bulb' active={true} last={false}/>
        <AmplificationTile icon='ios-videocam' active={false} last={false}/>
        <AmplificationTile icon='ios-microphone' active={false} last={false}/>
        <AmplificationTile icon='ios-image' active={false} last={true}/>
        {/* <Row style={{ marginLeft: "20%", marginRight: "20%" }}>
          <div className="ampTileChip">
            <Ionicon
              style={{
                position: "absolute",
                top: 9,
                left: 10,
              }}
              fontSize="30"

              color="#fff"
              icon="ios-bulb"
            />
          </div>
          <Col className="amplificationTile" fluid={false}></Col>
        </Row> */}
      </Container>
    </React.Fragment>
  );
};

export default Amplification;
