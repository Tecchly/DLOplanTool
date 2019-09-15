import React from "react";
import { app } from "./Firebase";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Icon } from "antd";
// import * as Button from './components/button';
import { Container, Navbar, Nav, Row, Col, Image } from "react-bootstrap";
import history from "./history";
import Ionicon from "react-ionicons";
import "./index.css";

//Reusable headerbar component
const HeaderBar = () => {
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
                src={require("./images/orange_logop.png")}
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
  </React.Fragment>
    
  )}

  export default HeaderBar;