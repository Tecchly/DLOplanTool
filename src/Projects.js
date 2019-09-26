import React, { useEffect } from "react";
import { app } from "./Firebase";
import firebase from "firebase";
import Firestore from "./Firestore.js";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import { Button, Icon } from "antd";
import { Container, Navbar, Nav, Row, Col, Image } from "react-bootstrap";
import HeaderBar from "./HeaderBar.js";
import history from "./history";
import Ionicon from "react-ionicons";
import ProjectLoader from "./ProjectLoader";
import ProjectView from "./ProjectView";
import useProjectDialog from "./useProjectDialog";

import "./index.css";
import { useState } from "react";
const emptyImages = [
  "void.svg",
  "empty.svg",
  "empty_1.svg",
  "empty_2.svg",
  "empty_3.svg"
];
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
  root_test: {
    height: "100%"
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
const Projects = props => {
  const { open, toggle } = useProjectDialog();
  const getGridListCols = () => {
    if (isWidthUp("xl", props.width)) {
      return 4;
    }

    if (isWidthUp("lg", props.width)) {
      return 3;
    }

    if (isWidthUp("md", props.width)) {
      return 2;
    }

    return 1;
  };
  const classes = useStyles();
  const [allProjects, pushProjects] = useState([]);
  const [noProjects, setNoProjects] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  const AllProjects = ({ project, size }) => (
    <ProjectTile x={project} size={size} />
  );
  var storage = firebase.storage().ref();

  const clickedProject = project => {
    setCurrentProject(project);
  };
  const closeProject = () => {
    setCurrentProject(null);
  };

  const addProject = project => {
    pushProjects(oldArray => [...oldArray, project]);
  };

  useEffect(() => {
    var uid = firebase.auth().currentUser.uid;
    var recents = Firestore.getAllProjectsByUser(uid, true);

    recents
      .get()
      .then(function(doc) {
        if (doc.empty) toggleNoProjects();
        doc.forEach(x => {
          var proj = x.data();
          proj.projectID = x.id;

          storage
            .child("projectImage/" + x.data().image)
            .getDownloadURL()
            .then(function(url) {
              proj.image = url;
              addProject(proj);
              // console.log(proj);
            });
        });
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      });
  }, []);
  function toggleNoProjects() {
    setNoProjects(!noProjects);
  }
  const editProject = x => {
    props.history.push({
      pathname: "./project",
      state: {
        projectID: x.projectID,
        title: x.title,
        topic: x.subtitle,
        medium: x.medium,
        image: x.image
      }
    });
  };
  const ProjectTile = ({ x, size }) => (
    <div
      key={x.creationTime}
      className={classes.recentProject}
      style={{
        backgroundImage: `url(${x.image})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        padding: 0,
        marginBottom: 10
      }}
      onClick={() => {
        toggle();
        clickedProject(x);
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
    </div>
  );

  const ProjectPlaceholder = () => (
    <Col
      className={classes.recentProject}
      style={{ backgroundColor: "#d6d6d6", padding: 0 }}
    >
      <Container fluid className={classes.projectOverlay}>
        <Container style={{ position: "absolute", bottom: 5 }}></Container>
      </Container>
    </Col>
  );
  return (
    <React.Fragment>
      <HeaderBar />
      <Container fluid={true}>
        <ProjectView
          open={open}
          hide={toggle}
          projectInfo={currentProject}
          edit={editProject}
        />
        <Container
          style={{ marginTop: 40, paddingLeft: 100, marginRight: 100 }}
          fluid
        >
          <Row>
            <Icon
              type="arrow-left"
              onClick={() => props.history.push("/")}
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
              Projects
            </h3>
          </Row>
        </Container>
        <Container style={{ marginTop: 40 }} fluid>
          <Row style={{ marginLeft: 80, marginRight: 80 }}>
            {allProjects.length == 0 && !noProjects ? <ProjectLoader /> : null}
            {noProjects ? (
              <Container style={{ marginTop: "20vh" }}>
                <Row className="justify-content-md-center">
                  <Image
                    src={require("./assets/images/" +
                      emptyImages[
                        Math.floor(Math.random() * emptyImages.length)
                      ])}
                    style={{ height: 180 }}
                  />
                </Row>
                <Row className="justify-content-md-center">
                  <h1 className="imageTitle" style={{ color: "#3A4A56" }}>
                    No Projects!
                  </h1>
                </Row>
                <Row className="justify-content-md-center">
                  <h2 className="imageSubtitle" style={{ color: "#8fa5b5" }}>
                    Click the 'New Project' button to create your first project!
                  </h2>
                </Row>
              </Container>
            ) : null}
            <GridList cols={getGridListCols()}>
              {allProjects
                .sort((a, b) => a.creationTime - b.creationTime)
                .map((project, index) => (
                  <GridListTile
                    key={project.creationTime}
                    classes={
                      getGridListCols() == 2
                        ? { root: "rootsm", tile: "tile" }
                        : getGridListCols() == 1
                        ? { root: "rootxs", tile: "tile" }
                        : getGridListCols() == 4
                        ? { root: "rootlg", tile: "tile" }
                        : { root: "root", tile: "tile" }
                    }
                  >
                    <AllProjects
                      key={index}
                      index={index}
                      project={project}
                      size={allProjects.length}
                    />
                  </GridListTile>
                ))}
            </GridList>
          </Row>
        </Container>
      </Container>
    </React.Fragment>
  );
};

export default withWidth()(Projects);
