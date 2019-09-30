import React, { useEffect } from "react";
import { app } from "./Firebase";
import firebase from "firebase";
import Firestore from "./Firestore.js";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Icon } from "antd";
import { Container, Navbar, Nav, Row, Col, Image } from "react-bootstrap";
import HeaderBar from "./HeaderBar.js";
import history from "./history";
import Ionicon from "react-ionicons";
import "./style.scss";
import NewProjectPopup from "./NewProject";
import { useState } from "react";
import ProjectLoader from "./ProjectLoader";
import ProjectView from "./ProjectView";
import useProjectDialog from "./useProjectDialog";
import useSettingsDialog from "./useSettingsDialog";
import SettingsDialog from "./SettingsDialog";
import { themeOptions } from "./styling/themeOptions";
import theme from './styling/theme.scss';
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
const emptyImages = [
  "void.svg",
  "empty.svg",
  "empty_1.svg",
  "empty_2.svg",
  "empty_3.svg"
];

const Home = ({ history }) => {
  const { open, toggle } = useProjectDialog();
  const { settingsOpen, toggleSettings } = useSettingsDialog();
  const classes = useStyles();
  const [showNewProject, setShowNewProject] = useState(false);
  const [noProjects, setNoProjects] = useState(false);
  const [recentProjects, pushRecentProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);

  const RecentProject = ({ project }) => <ProjectTile x={project} />;
  var storage = firebase.storage().ref();

  const addRecentProject = project => {
    pushRecentProjects(oldArray => [...oldArray, project]);
  };
  const clickedProject = project => {
    setCurrentProject(project);
  };
  
  useEffect(() => {
    var uid = firebase.auth().currentUser.uid;
    var recents = Firestore.getRecentProjectsByUser(uid);
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
              proj.id = x.id;
              addRecentProject(proj);
            });
        });
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
        toggleNoProjects();
      });
    var localCache = window.localStorage;
    return function cleanup() {
      if (localCache.getItem("showOtherGuide")) {
        localCache.removeItem("showOtherGuide");
      }
    }
  }, []);

  function togglePopup() {
    setShowNewProject(!showNewProject);
  }

  function toggleNoProjects() {
    setNoProjects(!noProjects);
  }

  function updateThemeForStyle() {
    const selectedTheme =
      themeOptions.find(t => t.name.toLowerCase() === "blue") || {};
    const html = document.getElementsByTagName("html")[0];
    Object.keys(selectedTheme).forEach((property, i) => {
      if (property === "name") {
        return;
      }
      html.style.setProperty(property, selectedTheme[property]);
    });
  }
  const IconButton = ({ icon, text, nav, classVal, guide }) => (
    <Col>
      <Button
        type="primary"
        size={"large"}
        className={classVal}
        guide={guide}
        onClick={() => {
          nav === "/" ? setShowNewProject(true) : history.push(nav);
        }}
      >
        <Icon type={icon} theme="filled" />
        {text}
      </Button>
    </Col>
  );

  const editProject = x => {
    history.push({
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
    </Col>
  );

  return (
    <React.Fragment>
      <HeaderBar steps={steps} />
      <Container fluid={true}>
        <ProjectView
          open={open}
          hide={toggle}
          projectInfo={currentProject}
          edit={editProject}
        />
        <SettingsDialog open={settingsOpen} hide={toggleSettings} />
        <div className="newProjectPopup">{showNewProject ? (
          //Popup will live here.
          <NewProjectPopup togglePopup={togglePopup} />
        ) : null} </div>
        <Row>
          <Container fluid={true} className="welcomeTile">
            <Row style={{ height: 200 }}>
              <Col sm={4}>
                <Image
                  src={require("./assets/images/project.svg")}
                  style={{ height: 220, width: "83%" }}
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
                <h2 className="welcomeTitle">
                  Welcome back,{" "}
                  {app.auth().currentUser.displayName.split(" ")[0]}
                </h2>
                <h3 className="welcomeSubtitle">lets create a project!</h3>
              </Col>
            </Row>
          </Container>
          <Container
            style={{ marginTop: 80, marginLeft: 100, marginRight: 100 }}
            fluid
          >
            <Row>
              <IconButton
                classVal="homeButtonOrange"
                icon="plus-circle"
                nav="/"
                text="New Project"
                guide="newProject"
              />
              <IconButton
                classVal="homeButton"
                icon="reconciliation"
                nav="/feedback"
                text="Feedback"
                guide="feedback"
              />
              <IconButton
                classVal="homeButton"
                icon="project"
                nav="/projects"
                text="Your Projects"
                guide="yourProjects"
              />
              <IconButton
                classVal="homeButton"
                icon="project"
                nav="/sharedprojects"
                text="Shared Projects"
                guide="sharedProjects"
              />
              <IconButton
                classVal="homeButton"
                icon="question-circle"
                text="Help"
                guide="help"
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

        <Container style={{ marginTop: 40 }} fluid className="recentProjects">
          <Row style={{ marginLeft: 80, marginRight: 80 }}>
            {recentProjects.length == 0 && !noProjects ? (
              <ProjectLoader />
            ) : null}
            {noProjects ? (
              <Container>
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
                    No Recent Projects!
                  </h1>
                </Row>
                <Row className="justify-content-md-center">
                  <h2 className="imageSubtitle" style={{ color: "#8fa5b5" }}>
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

const steps = [
  {
    selector: '.welcomestep',
    content: (<h3>Welcome to DLOPlanTool!</h3>),
  },
  {
    selector: '[guide="newProject"]',
    content: (<h5>Now lets start with creating a new project!</h5>),
    observe: '.newProjectPopup',
  },
  {
    selector: '[guide="inputProjectTitle"]',
    content: (<h5>input your meaningful project title here! such as "The Water Cycle"</h5>),
    action: node => {
      try {
        node.focus();
      } catch (e) {
        console.log(e)
      }
      // node.value="the water cycle";
    }
  },
  {
    selector: '[guide="inputProjectTopic"]',
    content: (<h5>input your short description for the project here!</h5>),
    action: node => {
      try {
        node.focus();
      } catch (e) {
        console.log(e)
      }
      // node.value="rain, river, ocean, cloud"
    }
  },
  {
    selector: '.chooseMedium',
    content: (<h6>Choose which type of medium you like to use in this project!</h6>),
    action: node => {
      try {
        node.focus();
      } catch (e) {
        console.log(e)
      }
    }
  },
  {
    selector: '.draggedImage',
    content: (<h6>You can drag an image from you local disk to here to represent your main idea of this project or just skip this step!</h6>)
  },
  {
    selector: '[guide="newProjectCreateButton"]',
    content: (<h6>Now click here to finish initializing your project!</h6>)
  },
  {
    selector: '[guide="yourProjects"]',
    content: (<h6>You can find the projects you created here! Or...</h6>),
    action: () => {
      var localCache = window.localStorage;
      if (localCache.getItem("showOtherGuide")) {
        localCache.removeItem("showOtherGuide");
      }
    }
  },
  {
    selector: '.recentProjects',
    content: (<h6>Find your latest 4 projects here!</h6>)
  },
  {
    selector: '[guide="sharedProjects"]',
    content: (<h6>Your friends may share projects with you, you can find them here!</h6>)
  },
  {
    selector: '.bell',
    content: (<h6>Also, you will receive a notice when your friend shared a project with you!</h6>)
  }
];

export default Home;
