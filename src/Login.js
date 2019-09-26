import React, { useContext } from "react";
import { withRouter, Redirect } from "react-router";
import { app, provider } from "./Firebase";
import { AuthContext } from "./Auth.js";
import { Container, Navbar, Nav, Row, Col, Image } from "react-bootstrap";
import BackgroundImage from "./assets/images/background.png";
import { Button, Icon } from "antd";
import Home from "./Home";
import Firestore from "./Firestore.js";
import "./style.scss";
import { themeOptions } from "./styling/themeOptions";
const Login = ({ history }) => {
  function handleLogin() {
    app
      .auth()
      .signInWithPopup(provider)
      .then(function(result) {
        history.push("/");
      })
      .catch(function(error) {
        alert(error);
      });
  }

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    var recents = Firestore.getUserData(currentUser.uid);
    recents
      .get()
      .then(function(doc) {
        var chosenColor = doc.data().color ? doc.data().color : "orange"
        const selectedTheme =
          themeOptions.find(t => t.name.toLowerCase() === chosenColor) ||
          {};
        localStorage.setItem("colorScheme", chosenColor);

        const html = document.getElementsByTagName("html")[0];
        Object.keys(selectedTheme).forEach((property, i) => {
          if (property === "name") {
            return;
          }

          html.style.setProperty(property, selectedTheme[property]);
        });
      })
      .catch(function(error) {
        console.log("Error getting document:", error);
      });

    return <Redirect to="/" />;
  }
  return (
    <div
      id="login"
      style={{
        height: "100%"
        // backgroundImage: `url(${BackgroundImage})`,
        // backgroundRepeat: "no-repeat",
        // backgroundPosition: "center",
        // backgroundSize: "contain"
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
        <Row>
          <h1
          className="headerRowLoginTitle"
            style={{
              textAlign: "center",

              fontFamily: "Montserrat",
              fontWeight: "600",
              margin: 20,
              fontSize: 22
            }}
          >
            Digital Learning
          </h1>
        </Row>
        <Container style={{ marginTop: "20vh" }}>
          <Row className="justify-content-md-center">
            <Image
              src={require("./assets/images/blue_logo.png")}
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
                fontSize: 40
              }}
            >
              Log in
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
              Sign in and start planning your next project!
            </h2>
          </Row>
          <Row className="justify-content-md-center" style={{ marginTop: 20 }}>
            <Button
              type="primary"
              size={"large"}
              onClick={handleLogin}
              className="loginButton"
              style={{
                paddingLeft: 20,
                paddingRight: 20,
                boxShadow: "0px 2px 10px -4px rgba(0,0,0,0.5)",

                border: "none",
                fontFamily: "Montserrat",
                borderRadius: 17,
                height: 50,
                fontWeight: "400"
              }}
            >
              <Icon type="google" />
              Sign in with Google
            </Button>
          </Row>
        </Container>
      </Container>
    </div>
  );
};

export default withRouter(Login);
