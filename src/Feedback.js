import firestore from "firebase/firestore";
import Firestore from "./Firestore.js";
import React from "react";
import { app } from "./Firebase";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Icon } from "antd";
import { Container, Navbar, Nav, Row, Col, Image } from "react-bootstrap";
import history from "./history";
import HeaderBar from "./HeaderBar.js"
import Ionicon from "react-ionicons";
import "./style.scss";
import FeedbackContent from './FeedbackContent';
import { withRouter } from 'react-router';


function beef() {
  console.log(app.auth().currentUser.uid);
}


function isEmpty(obj) {
  for (var key in obj) {
    if (obj[key].projectID) 
      return false;
  }
  return true;
}

function renderFeedbackData() {
  var feedback;

  feedbackData.forEach(item => {
    console.log(app.firestore().collection("users").doc(item.reviewerID).projects);
    feedback += app.firestore().collection("users").doc(item.reviewerID).Name + " left feedback on your project " + item.projectID;
    feedback += "";
    feedback += item.type == "praise" ?  " COMMEND IMG": "";
    feedback += item.comment;

  });

  return feedback;
}

// mock test data

var feedbackData1 = [
    { "projectID": "",
      "reviewerID": "",
      "timestamp": "",
      "type": "",
      "comment": ""
    }
];

var feedbackData = [
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


const Feedback = ({ history }) => {

  const loadProject = row => {
    var proj = row.project;
    history.push({
      pathname: "./project",
      state: {
        projectID: row.projectId,
        medium: proj.medium,
        title: proj.title,
        topic: proj.subtitle,
        image: proj.image,
    }});
  }
  

  return (
    <React.Fragment>
      <HeaderBar />
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
        <FeedbackContent loadProject={loadProject}/>
      
      </Container>
    </React.Fragment>
  );
};

export default withRouter(Feedback);
