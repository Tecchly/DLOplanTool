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


const Amplification = ({ history }) => {
  const [ideaKeyWords, pushIdeaKeyWords] = useState([]);
  const addIdea = ideas => {
    pushIdeaKeyWords(oldArray => [...oldArray, ideas]);
  };

  const [topicNotes, pushTopicNotes] = useState([]);
  const addTopicNotes = topic => {
    pushTopicNotes(topic);
  };

  const [selectedTopic, setSelectedTopic] = useState(0);
  const changeSelect = topic => {
    setSelectedTopic(topic);
    console.log(selectedTopic)
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
            index={0}
            active={selectedTopic==0}
            last={false}
            words={topicNotes}
            parentCallback={changeSelect}
          />
        ) : null}

        {ideaKeyWords
          ? ideaKeyWords.map((x, i) => (
              <AmplificationTile
                icon={x.icon}
                key={i}
                index={i+1}
                active={selectedTopic == i+1}
                last={ideaKeyWords.length-1 == i}
                words={x}
                parentCallback={changeSelect}
              />
            ))
          : null}
      </Container>
    </React.Fragment>
  );
};

export default Amplification;
