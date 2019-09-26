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
import "./index.css";
import FeedbackContent from './FeedbackContent';


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

  const noFeedback = () => {
    return (<Container
      className="d-flex align-items-center"
      style={{ marginTop: "20vh", flexDirection: 'column' }}
    >
      <Row></Row>
      <Row className="justify-content-md-center">
        <Image
          src={require("./assets/images/feedback.svg")}
          style={{ height: 220 }}
        />
      </Row>
      <Row className="justify-content-md-center">
        <h1
          style={{
            textAlign: "center",
            color: "#3A4A56",
            fontFamily: "Montserrat",
            fontWeight: "700",
            textAlign: "center",
            fontSize: 30
          }}
        >
          No Feedback
        </h1>
      </Row>
      <Row className="justify-content-md-center">
        <h2
          style={{
            textAlign: "center",
            color: "#8fa5b5",
            fontFamily: "Montserrat",
            fontWeight: "600",
            textAlign: "center",
            fontSize: 15
          }}
        >
          <br />
          <br />
          When feedback is given, you will see it here!
        </h2>
      </Row>
    </Container>);
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
        {isEmpty(feedbackData) ? (noFeedback()) : (<Container
              className="d-flex align-items-center"
              
            >
              {/* <Row></Row> */}
                {/* {renderFeedbackData()} */}
                <FeedbackContent />
            </Container>)}
      
      </Container>
    </React.Fragment>
  );
};

export default Feedback;
