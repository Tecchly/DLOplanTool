import React from "react";
import { app } from "./Firebase";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Icon } from "antd";
// import * as Button from './components/button';
import { Container, Navbar, Nav, Row, Col, Image } from "react-bootstrap";
import history from "./history";
import Ionicon from "react-ionicons";
import "./index.css";
import NewProjectPopup from "./NewProject";
import P1 from "../assets/images/poster1.jpg";
import P2 from "../assets/images/poster2.jpg";
import P3 from "../assets/images/poster3.png";
import P4 from "../assets/images/poster4.png";
import { useState } from "react";

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

const Home = ({ history }) => {
  // const classes = useStyles();
  const classes = useStyles();
  const [showNewProject, setShowNewProject] = useState(false);

  function togglePopup() {
    setShowNewProject(!showNewProject);
  }
  const IconButton = ({ bcolor, icon, text, nav, tcolor }) => (
    <Col>
      <Button
        type="primary"
        size={"large"}
        className={classes.button}
        style={{ backgroundColor: bcolor, color: tcolor }}
        onClick={() => {
          nav === "/" ? setShowNewProject(true) : history.push(nav);
        }}
      >
        <Icon type={icon} theme="filled" />
        {text}
      </Button>
    </Col>
  );

  const ProjectTile = ({ image }) => (
    <Col
      className={classes.recentProject}
      style={{
        backgroundImage: `url(${image})`,
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
  );

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
      <div style={{textAlign: "center", height: '100%', width: '100%'}}>
                    <svg height = '100%' width = '100%'>
                        <circle stroke="#000" r="30%" id="svg_1" cy="50%" cx="50%" strokeWidth="1.5" fill="#fff"/>
                        <circle stroke="#000" r="22%" id="svg_2" cy="50%" cx="50%" strokeWidth="1.5" fill="#fff"/>
                        <circle stroke="#000" r="14%" id="svg_3" cy="50%" cx="50%" strokeWidth="1.5" fill="#fff"/>
                        <clipPath id="myCircle">
                            <circle cx="50%" cy="50%" r="125" fill="#FFFFFF" />
                        </clipPath>
                        <image y="40%" x="40%" width="20%" xlinkHref={P1} clip-path="url(#myCircle)" />
                        <circle stroke="#000" r="20" id="svg_3" cy="90%" cx="50" strokeWidth="1.5" fill="red"/>
                        <circle stroke="#000" r="20" id="svg_3" cy="90%" cx="100" strokeWidth="1.5" fill="pink"/>
                        <circle stroke="#000" r="20" id="svg_3" cy="90%" cx="150" strokeWidth="1.5" fill="purple"/>
                        <circle stroke="#000" r="20" id="svg_3" cy="90%" cx="200" strokeWidth="1.5" fill="navy"/>
                    </svg>
                </div>
    </React.Fragment>
  );
};

export default Home;
