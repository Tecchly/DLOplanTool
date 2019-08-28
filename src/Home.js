import React from "react";
import { app } from "./Firebase";
import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import { Container, Navbar, Nav, Row, Col, Image } from "react-bootstrap";

import Ionicon from "react-ionicons";

const useStyles = makeStyles(theme => ({
  button: {

    backgroundColor: '#e08845',
    width: '90%',
    height: 40,
    textTransform: 'none',
    color: 'white',
    fontFamily: "Montserrat",
                fontWeight: "400",

  },
  leftIcon: {
    left:0,


  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  iconSmall: {
    fontSize: 20,
  },
}));
const Home = () => {
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
                color: "#E08845",
                fontFamily: "Montserrat",
                fontWeight: "600",
                fontSize: 22
              }}
              href="#"
            >
              Digital Learning
            </Navbar.Brand>
          </Col>
          <Col style={{}}>
            <Nav className="mr-auto"></Nav>
            <Nav>
              <img
                alt="profile"
                src={app.auth().currentUser.photoURL}
                style={{ width: 40, height: 40, borderRadius: 20, cursor:'pointer' }}
                onClick={() => app.auth().signOut()}
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
              height: 200
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
                    color: "#3A4A56",
                    fontFamily: "Montserrat",
                    fontWeight: "700"
                  }}
                >
                  Welcome back,{" "}
                  {app.auth().currentUser.displayName.split(" ")[0]}
                </h2>
                <h3
                  style={{
                    color: "#E08845",
                    fontFamily: "Montserrat",
                    fontWeight: "600"
                  }}
                >
                  lets create a project!
                </h3>
              </Col>
            </Row>
          </Container>
          <Container style={{marginTop: 30,marginLeft: 100,
              marginRight: 100,}} fluid>
            <Row>
              <Col>
              <Button variant="contained" color="#E08845" className={classes.button}>
                <Ionicon icon="ios-add" color="white" className={classes.leftIcon}></Ionicon>
                New Project
              </Button>
              </Col>
              <Col>
              <Button variant="contained" color="#E08845" className={classes.button}>
                <Ionicon icon="ios-list-box" color="white" className={classes.leftIcon}></Ionicon>
                Feedback
              </Button>
              </Col>
              <Col>
              <Button variant="contained" color="#E08845" className={classes.button}>
                <Ionicon icon="ios-copy" color="white" className={classes.leftIcon}></Ionicon>
                Your Projects
              </Button>
              </Col>
              <Col>
              <Button variant="contained" color="#E08845" className={classes.button}>
                <Ionicon icon="ios-help-circle" color="white" className={classes.leftIcon}></Ionicon>
                Help
              </Button>
              </Col>
            </Row>
          </Container>
        </Row>
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
