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
import retext from "retext";
import pos from "retext-pos";
import keywords from "retext-keywords";
import toString from "nlcst-to-string";
import mappingData from "../assets/map_data.json";

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
  const [ideaKeyWords, pushIdeaKeyWords] = useState([]);
  const addIdea = ideas => {
    pushIdeaKeyWords(oldArray => [...oldArray, ideas]);
  };

  const [topicNotes, pushTopicNotes] = useState([]);
  const addTopicNotes = topic => {
    pushTopicNotes(topic);
  };

  useEffect(() => {
    let keyWordList = [];
    let topicNotesList = [];
    var allIdeas = words();
    var mainTopic = topic();
    console.log(mainTopic);
    Object.values(allIdeas).forEach(info => {
      console.log(info);
      keyWordList = [];
      retext()
        .use(pos)
        .use(keywords)
        .process(info.notes, (err, file) => {
          if (err) throw err;
          //keywords
          file.data.keywords.forEach(function(keyword) {
            keyWordList.push(toString(keyword.matches[0].node));
          });
          //key phrases
          file.data.keyphrases.forEach(phrase => {
            keyWordList.push(phrase.matches[0].nodes.map(stringify).join(""));
            function stringify(value) {
              return toString(value);
            }
          });
        });
      info.keywords = keyWordList;
      addIdea(info);
    });
    retext()
      .use(pos)
      .use(keywords)
      .process(mainTopic.notes, (err, file) => {
        if (err) throw err;
        //keywords
        file.data.keywords.forEach(function(keyword) {
          topicNotesList.push(toString(keyword.matches[0].node));
        });
        //key phrases
        file.data.keyphrases.forEach(phrase => {
          topicNotesList.push(phrase.matches[0].nodes.map(stringify).join(""));
          function stringify(value) {
            return toString(value);
          }
        });
      });

    mainTopic["keywords"] = topicNotesList;
    addTopicNotes(mainTopic);
  }, []);

  function words() {
    var ideas = {};
    let index = 0;
    mappingData.Ideas.map(idea => {
      ideas[idea.id] = {
        id: index,
        mode: idea.mode,
        title: idea.title,
        icon: idea.icon,
        notes: idea.notes.join(" ")
      };
      index++;
    });
    return ideas;
  }

  function topic() {
    var topicInfo = {
      medium: mappingData.Topic.medium,
      title: mappingData.Topic.title,
      subtitle: mappingData.Topic.subtitle,
      notes: mappingData.Topic.notes.join(" ")
    };
    return topicInfo;
  }

  // setTimeout(
  //   function() {
  //     console.log(topicNotes);
  //   }.bind(this),
  //   5000
  // );
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
        {topicNotes ? (
          <AmplificationTile
            icon="ios-bulb"
            active={true}
            last={false}
            words={topicNotes}
          />
        ) : null}

        {ideaKeyWords
          ? ideaKeyWords.map((x, i) => (
              <AmplificationTile
                icon={x.icon}
                key={i}
                active={false}
                last={ideaKeyWords.length-1 == i}
                words={x}
              />
            ))
          : null}
        {/* <AmplificationTile
          icon="ios-bulb"
          active={true}
          last={false}
          words={ideaKeyWords[0]}
        />
        <AmplificationTile
          icon="ios-videocam"
          active={false}
          last={false}
          words={ideaKeyWords[1]}
        />
        <AmplificationTile
          icon="ios-microphone"
          active={false}
          last={false}
          words={ideaKeyWords[2]}
        />
        <AmplificationTile
          icon="ios-image"
          active={false}
          last={true}
          words={ideaKeyWords[3]}
        /> */}
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
