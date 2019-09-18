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
import ProjectLoader from "./ProjectLoader";
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
const emptyImages = ["void.svg","empty.svg","empty_1.svg","empty_2.svg","empty_3.svg"]

const Home = ({ history }) => {
  const classes = useStyles();
  const [showNewProject, setShowNewProject] = useState(false);
  const [noProjects, setNoProjects] = useState(false);
  const [recentProjects, pushRecentProjects] = useState([]);
  const RecentProject = ({ project }) => <ProjectTile x={project} />;
  var storage = firebase.storage().ref();

  const addRecentProject = project => {
    pushRecentProjects(oldArray => [...oldArray, project]);
  };

  useEffect(() => {
    var uid = firebase.auth().currentUser.uid;
    var recents = Firestore.getRecentProjectsByUser(uid);

    recents
      .get()
      .then(function(doc) {
        if (doc.empty) toggleNoProjects()
        doc.forEach(x => {
          var proj = x.data();
          proj.projectID = x.id;
          storage
            .child("projectImage/" + x.data().image)
            .getDownloadURL()
            .then(function(url) {
              proj.image = url;
              addRecentProject(proj);
              console.log(proj);

            });
        });
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
        toggleNoProjects()
      });

  }, []);

  function togglePopup() {
    setShowNewProject(!showNewProject);
  }

  function toggleNoProjects() {
    setNoProjects(!noProjects);

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

  const ProjectTile = ({ x }) => (
    <Col
      key={x.creationTime}
      className={classes.recentProject}
      style={{
        backgroundImage: `url(${x.image})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        padding: 0
      }}
      onClick = {()=>{
        console.log(x.projectID); //push this project id and title/subtitle to project page. 
      }}
    >
      <Container fluid className={classes.projectOverlay}>
        <Container style={{ position: "absolute", bottom: 5 }}>
          <Row>
            <h2 className={classes.title}>{x.title}</h2>
          </Row>
          <Row>
            <h3 className={classes.subtitle}>{x.subtitle}</h3>
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
      <Container fluid={true}>
        {showNewProject ? (
          //Popup will live here.
          <NewProjectPopup togglePopup={togglePopup} />
        ) : null}
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
              <Col sm={4}>
                <Image
                  src={require("../assets/images/book.svg")}
                  style={{ height: 220 }}
                />
              </Col>
              <Col
                sm={8}
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
              <IconButton
                bcolor="#FA8231"
                tcolor="#FFF"
                icon="plus-circle"
                nav="/"
                text="New Project"
              />
              <IconButton
                bcolor="#FFF"
                tcolor="#FA8231"
                icon="reconciliation"
                nav="/feedback"
                text="Feedback"
              />
              <IconButton
                bcolor="#FFF"
                tcolor="#FA8231"
                icon="project"
                nav="/projects"
                text="Your Projects"
              />
              <IconButton
                bcolor="#FFF"
                tcolor="#FA8231"
                icon="question-circle"
                nav="/"
                text="Help"
              />
            </Row>
          </Container>
        </Row>
        <Container
          style={{ marginTop: 80, paddingLeft: 100, marginRight: 100 }}
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
            {recentProjects.length == 0 &&  !noProjects? 
              <ProjectLoader />: null}
              {
              noProjects ? (
              <Container >
                <Row className="justify-content-md-center">
                  <Image
                    src={require("../assets/images/" + emptyImages[Math.floor(Math.random()*emptyImages.length)])}
                    style={{ height: 180 }}
                  />
                </Row>
                <Row className="justify-content-md-center">
                  <h1
                    className="imageTitle"
                    style={{color: "#3A4A56"}}
                  >
                    No Recent Projects!
                  </h1>
                </Row>
                <Row className="justify-content-md-center">
                  <h2
                  className="imageSubtitle"
                    style={{color: "#8fa5b5"}}
                  >
                    Click the 'New Project' button to create your first project!
                  </h2>
                </Row>
              </Container>
            ) : null}
            {recentProjects
              .sort((a, b) => a.creationTime - b.creationTime)
              .map((project, index) => (
                <RecentProject key={index} index={index} project={project} />
              ))}
          </Row>
        </Container>
      </Container>
    </React.Fragment>
  );
};

export default Home;
