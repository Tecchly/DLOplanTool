import React from "react";
import { app } from "./Firebase";
import firestore from "firebase/firestore";
import Firestore from "./Firestore.js";
import { Button, Icon } from "antd";
import { Container, Navbar, Nav, Row, Col, Image } from "react-bootstrap";
import history from "./history";
import Ionicon from "react-ionicons";
import "./index.css";


function beef() {
  console.log(app.auth().currentUser.uid);
}


function isEmpty(obj) {
  for (var key in obj) {
    // console.log(obj[key].projectID);
    if (obj[key].projectID) 
      return false;
  }
  console.log("no feedback");
  return true;
}


const Feedback = ({ history }) => {

  if (!isEmpty(fb)) {

    console.log("you have feedback");

    return (
      <React.Fragment>
        <Navbar
          collapseOnSelect
          expand="lg"
          bg="light"
          variant="light"
          style={{
            boxShadow: "0px 2px 10px -4px rgba(0,0,0,0.2)"
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
                  color: "#FA8231",
                  fontFamily: "Montserrat",
                  fontWeight: "600",
                  fontSize: 22
                }}
                href="#"
              >
                <Image
                  src={require("../assets/images/orange_logop.png")}
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
              class="d-flex align-items-center"
              style={{ marginTop: "20vh" }}
            >
              <Row></Row>
              <Row className="justify-content-md-center">
                <Image
                  src={require("../assets/images/feedback.svg")}
                  style={{ height: 220 }}
                />
              </Row>            
            </Container>
        </Container>
      </React.Fragment>
    );


  }
  else {
    console.log("no feedback");
    return (
      <React.Fragment>
        <Navbar
          collapseOnSelect
          expand="lg"
          bg="light"
          variant="light"
          style={{
            boxShadow: "0px 2px 10px -4px rgba(0,0,0,0.2)"
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
                  color: "#FA8231",
                  fontFamily: "Montserrat",
                  fontWeight: "600",
                  fontSize: 22
                }}
                href="#"
              >
                <Image
                  src={require("../assets/images/orange_logop.png")}
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
              class="d-flex align-items-center"
              style={{ marginTop: "20vh" }}
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
                  When feedback is given, you will see it here!
                </h2>
              </Row>
            </Container>
          
        </Container>
      </React.Fragment>
    );
  }
}

const displayFeedback = ({ history }) => {

  beef();
  console.log(isEmpty(fb));

return (
    <React.Fragment>
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="light"
        variant="light"
        style={{
          boxShadow: "0px 2px 10px -4px rgba(0,0,0,0.2)"
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
                color: "#FA8231",
                fontFamily: "Montserrat",
                fontWeight: "600",
                fontSize: 22
              }}
              href="#"
            >
              <Image
                src={require("../assets/images/orange_logop.png")}
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
            class="d-flex align-items-center"
            style={{ marginTop: "20vh" }}
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
                When feedback is given, you will see it here!
              </h2>
            </Row>
          </Container>
        
      </Container>
    </React.Fragment>
  );
};

export default Feedback;


// mock test data

var empty = [
    { "projectID": "",
      "reviewerID": "",
      "timestamp": "",
      "type": "",
      "comment": ""
    }
];

var fb = [
  { "projectID": "7bw8VvWbHKdY3AXxKMPF",
    "reviewerID": "bn2YITj65beCuLnQmEfVdE6Qfup2",
    "timestamp": "September 2 2019 13:32",
    "type": "feedback",
    "comment": "Well done overall, looking forward to seeing the finished project!"
  },
  { "projectID": "7bw8VvWbHKdY3AXxKMPF",
    "reviewerID": "bn2YITj65beCuLnQmEfVdE6Qfup2",
    "timestamp": "August 31 2019 12:20" ,
    "type": "praise",
    "comment": "Good mapping to mode"
  },
  { "projectID": "cABtDFfLjeubLrsHOwbV",
    "reviewerID": "bn2YITj65beCuLnQmEfVdE6Qfup2",
    "timestamp": "August 31 2019 12:22",
    "type": "comment",
    "comment": "I think you should look into a different methond of expressing the idea."
  }
];
