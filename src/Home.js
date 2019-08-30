import React from "react";
import { app } from "./Firebase";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Icon } from "antd";
// import * as Button from './components/button';
import { Container, Navbar, Nav, Row, Col, Image } from "react-bootstrap";
import history from "./history";
import Ionicon from "react-ionicons";
import "./index.css";
import P1 from "../assets/images/poster1.jpg";
import P2 from "../assets/images/poster2.jpg";
import P3 from "../assets/images/poster3.png";
import P4 from "../assets/images/poster4.png";
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
function handleFormReset(e) {
  // Reset some form data
}
const Home = () => {
  // const classes = useStyles();
  const classes = useStyles();
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
        <Row>
          <Container
            fluid={true}
            style={{
              backgroundColor: "#F1D0B2",
              borderRadius: 16,
              marginLeft: 100,
              marginRight: 100,
              marginTop: 40,
              height: 200,
              boxShadow: "0px 2px 10px -4px rgba(0,0,0,0.5)"
            }}
          >
            <Row style={{ height: 200 }}>
              <Col sm={4} fluid>
                <Image
                  src={require("../assets/images/book.svg")}
                  style={{ height: 220 }}
                />
              </Col>
              <Col
                sm={8}
                fluid
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center"
                }}
              >
                <h2
                  style={{
                    color: "#2F4858",
                    fontFamily: "Montserrat",
                    fontWeight: "700"
                  }}
                >
                  Welcome back,{" "}
                  {app.auth().currentUser.displayName.split(" ")[0]}
                </h2>
                <h3
                  style={{
                    color: "#FA8231",
                    fontFamily: "Montserrat",
                    fontWeight: "600"
                  }}
                >
                  lets create a project!
                </h3>
              </Col>
            </Row>
          </Container>
          <Container
            style={{ marginTop: 80, marginLeft: 100, marginRight: 100 }}
            fluid
          >
            <Row>
              <Col>
                <Button
                  type="primary"
                  size={"large"}
                  className={classes.button}
                  style={{ backgroundColor: "#FA8231" }}
                >
                  <Icon type="plus-circle" theme="filled" />
                  New Project
                </Button>
              </Col>
              <Col>
                <Button
                  type="primary"
                  size={"large"}
                  className={classes.button}
                  style={{ backgroundColor: "#fff", color: "#FA8231" }}
                >
                  <Icon type="reconciliation" theme="filled" />
                  Feedback
                </Button>
              </Col>
              <Col>
                <Button
                  type="primary"
                  size={"large"}
                  className={classes.button}
                  style={{ backgroundColor: "#fff", color: "#FA8231" }}
                >
                  <Icon type="project" theme="filled" />
                  Your Projects
                </Button>
              </Col>
              <Col>
                <Button
                  type="primary"
                  size={"large"}
                  className={classes.button}
                  style={{ backgroundColor: "#fff", color: "#FA8231" }}
                >
                  <Icon type="question-circle" theme="filled" />
                  Help
                </Button>
              </Col>
            </Row>
          </Container>
        </Row>
        <Container
          style={{ marginTop: 80, marginLeft: 100, marginRight: 100 }}
          fluid
        >
          <Row>
            <h3
              style={{
                color: "#2F4858",
                fontFamily: "Montserrat",
                fontWeight: "700"
              }}
            >
              Recent Projects
            </h3>
          </Row>
        </Container>

        <Container style={{ marginTop: 40 }} fluid>
          <Row style={{ marginLeft: 80, marginRight: 80 }}>
            <Col
              className={classes.recentProject}
              style={{
                backgroundImage: `url(${P1})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                padding: 0
              }}
            >
              <Container fluid className={classes.projectOverlay}>
                <Container style={{ position: "absolute", bottom: 5 }}>
                  <Row>
                    <h2 className={classes.title}>Project Title</h2>
                  </Row>
                  <Row>
                    <h3 className={classes.subtitle}>Project Subtitle</h3>
                  </Row>
                </Container>
              </Container>
            </Col>
            <Col
              className={classes.recentProject}
              style={{
                backgroundImage: `url(${P2})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                padding: 0
              }}
            >
              <Container fluid className={classes.projectOverlay}>
                <Container style={{ position: "absolute", bottom: 5 }}>
                  <Row>
                    <h2 className={classes.title}>Project Title</h2>
                  </Row>
                  <Row>
                    <h3 className={classes.subtitle}>Project Subtitle</h3>
                  </Row>
                </Container>
              </Container>
            </Col>
            <Col
              className={classes.recentProject}
              style={{
                backgroundImage: `url(${P3})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                padding: 0
              }}
            >
              <Container fluid className={classes.projectOverlay}>
                <Container style={{ position: "absolute", bottom: 5 }}>
                  <Row>
                    <h2 className={classes.title}>Project Title</h2>
                  </Row>
                  <Row>
                    <h3 className={classes.subtitle}>Project Subtitle</h3>
                  </Row>
                </Container>
              </Container>
            </Col>
            <Col
              className={classes.recentProject}
              style={{
                backgroundImage: `url(${P4})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                padding: 0
              }}
            >
              <Container fluid className={classes.projectOverlay}>
                <Container style={{ position: "absolute", bottom: 5 }}>
                  <Row>
                    <h2 className={classes.title}>Project Title</h2>
                  </Row>
                  <Row>
                    <h3 className={classes.subtitle}>Project Subtitle</h3>
                  </Row>
                </Container>
              </Container>
            </Col>
          </Row>
        </Container>
      </Container>

      {/* <div>
        <div></div>
      </div>
      <h1>Home</h1> */}
      {/* <Ionicon icon="md-basket" fontSize="35px" color="rgb(125, 176, 24)"/> */}
      {/* <h2>{app.auth().currentUser.displayName}</h2>

      
      <h3><button onClick={() => app.auth().signOut()}>Sign out</button></h3> */}
    </React.Fragment>
  );
};

export default Home;
