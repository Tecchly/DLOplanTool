import React, { useContext } from "react";
import { withRouter, Redirect } from "react-router";
import { app, provider } from "./Firebase";
import { AuthContext } from "./Auth.js";
import { Container, Navbar, Nav, Row, Col, Image } from "react-bootstrap";
import BackgroundImage from '../assets/images/background.png'


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
    return <Redirect to="/" />;
  }

  return (
    <div
      style={{
        height: "100%",
        backgroundImage: `url(${BackgroundImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover'
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
          <h1 style={{
                textAlign: "center",
                color: "#E08845",
                fontFamily: "Montserrat",
                fontWeight: "600",
                margin: 20,
                fontSize: 22
              }}>Digital Learning</h1>
        </Row>
        <Row className="justify-content-md-center">
          
          <Image
            src={require("../assets/images/blue_logo.png")}
            style={{ height: 220 }}
          />
        </Row>
        <Row className="justify-content-md-center">

          <h1 style={{
                textAlign: "center",
                color: "#3A4A56",
                fontFamily: "Montserrat",
                fontWeight: "700",
                textAlign: 'center',
                fontSize:40,
                
              }}>Log in</h1>


        </Row>
        <Row className="justify-content-md-center">

          <h2 style={{
                textAlign: "center",
                color: "#8fa5b5",
                fontFamily: "Montserrat",
                fontWeight: "600",
                textAlign: 'center',
                fontSize:15,
                
              }}>Sign in and start planning your next project!</h2>


        </Row>
        <Row className="justify-content-md-center" style={{marginTop: 20}}>
          <button style={{padding: '5px 50px 5px 50px', borderStyle: 'none',fontFamily: "Montserrat",borderRadius: 15, backgroundColor:"#E08845", color: 'white' }} onClick={handleLogin}> 
          
          Sign in with Google</button>
        </Row>
        
      </Container>
    </div>
  );
};

export default withRouter(Login);
