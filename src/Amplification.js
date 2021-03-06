import React, { useEffect } from "react";
import { app } from "./Firebase";
import firebase from "firebase";
import Firestore from "./Firestore.js";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Icon } from "antd";
import { Container, Navbar, Nav, Row, Col, Image } from "react-bootstrap";
import history from "./history";
import Ionicon from "react-ionicons";
import "./style.scss";
import NewProjectPopup from "./NewProject";
import { useState } from "react";
import AmplificationTile from "./AmplificationTile";
import Wave from "./assets/images/wave_orange.png";
import retext from "retext";
import pos from "retext-pos";
import keywords from "retext-keywords";
import toString from "nlcst-to-string";
import Utils from "./Utils";
import IconButton from "@material-ui/core/IconButton";
import BackIcon from "@material-ui/icons/ArrowBack";
const Amplification = ( props ) => {
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
  };

  const [amplificationOptions, addAmplificationOptions] = useState({});

  const saveTopicAmplifications = (topic, location, project, options, next) => {
    amplificationOptions[topic] = options;
    amplificationOptions[topic].location = location;
    addAmplificationOptions(amplificationOptions);
    if (next) changeSelect(next)
    //if next is null then it is the last section so all sections
    //are complete so save to firestore here
    else {
      for (const [key, value] of Object.entries(amplificationOptions)) {
        // console.log(value["location"]);
        Firestore.deleteAmplifications(
          project,
          value["location"]
        ).then(function(){
          for (const [key2, value2] of Object.entries(value)) {
            if (key2 != "location"){
              Firestore.saveAmplification(
                project,
                value["location"],
                Utils.uuid(),
                value2
              )
            }

        }}).then(function(){
          props.history.push({
            pathname: "./project",
            state:{
              projectID: props.location.state.projectID,
              title: props.location.state.title,
              topic: props.location.state.topic,
              medium: props.location.state.medium,
              image: props.location.state.image
            }
          })
        });
      }
    }
  };

  useEffect(() => {

    var ideas = Firestore.getIdeas(firebase.auth().currentUser.uid,props.location.state.projectID);
    let keyWordList = [];
    let topicNotesList = [];
    words(ideas).then(function (result){
      var mainTopic = topic(result["topic"]);

      Object.keys(result["ideas"]).forEach(info => {

        keyWordList = [];
        retext()
          .use(pos)
          .use(keywords)
          .process(result["ideas"][info].notes, (err, file) => {
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
        result["ideas"][info].keywords = keyWordList;
        result["ideas"][info].location = info;
        result["ideas"][info].project = mainTopic.project;
        addIdea(result["ideas"][info]);
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
    });
  }, []);

  function words(loadIdeas) {
    var promise1 = new Promise(function(resolve, reject) {
      var index = 0;
      var ideas = {};
      var topic = {}
      loadIdeas.then(function(idea) {
        idea.forEach(x=>{
          var data = x.data();
          if (x.id == "root"){
            topic = {
              medium: data.mode,
              topic: data.title
            };
          }
          else{
            let index = 0;
              ideas[x.id] = {
                id: index,
                mode: data.mode,
                title: data.title,
                icon: Utils.modeToIcon(data.mode),
                notes: data.notes
              };
              index++;
            }
       });

       var result = {ideas, topic};

       resolve(result);
    });
  });
  return promise1;
  }

  function topic(topic) {
    var topicInfo = {
      medium: topic.medium,
      title: props.location.state.title,
      subtitle: topic.subtitle,
      notes: "",
      location: "root",
      project: props.location.state.projectID
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
          backgroundImage: `url(${require("./assets/images/wave_" + localStorage.getItem("colorScheme") + ".png")})`,
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
            justifyContent: "center",
            flexWrap: "nowrap"
          }}
        >
          <Col>
            <IconButton
                aria-label="send"
                onClick={() => {
                  //props.history.goBack();
                  props.history.push({
                    pathname: "./project",
                    state:{
                      projectID: props.location.state.projectID,
                      title: props.location.state.title,
                      topic: props.location.state.topic,
                      medium: props.location.state.medium,
                      image: props.location.state.image
                    }
                  })
                }}
                className="backArrowButton"
              >
                <BackIcon fontSize="large" />
              </IconButton>
            </Col>
          <Col
            className="justify-content-md-center"
            xs={9}
            style={{ textAlign: "center" }}
          >

            <Navbar.Brand
              style={{
                textAlign: "center",
                color: "#000",
                fontFamily: "Montserrat",
                fontWeight: "600",
                fontSize: 22,
                cursor: "pointer"
              }}
              onClick={() => {
                props.history.push("/");
              }}
            >
              <Image
                src={require("./assets/images/orange_logo_white.png")}
                style={{ height: 30, marginLeft: 5, marginBottom: 2 }}
              />
              MAPIC: A digital-learning object (DLO) Design Tool for Students
            </Navbar.Brand>
          </Col>
          <Col style={{}}>

            <Nav style={{float:"right"}}>
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
                  props.history.push("/login");
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
            active={selectedTopic == 0}
            last={false}
            words={topicNotes}
            parentCallback={changeSelect}
            setAmplificationOptions={saveTopicAmplifications}
          />
        ) : null}

        {ideaKeyWords
          ? ideaKeyWords.map((x, i) => (
              <AmplificationTile
                icon={x.icon}
                key={i}
                index={i + 1}
                active={selectedTopic == i + 1}
                last={ideaKeyWords.length - 1 == i}
                words={x}
                parentCallback={changeSelect}
                setAmplificationOptions={saveTopicAmplifications}
              />
            ))
          : null}
      </Container>
    </React.Fragment>
  );
};

export default Amplification;
