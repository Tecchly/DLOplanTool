import React from "react";
import { app } from "./Firebase";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Icon } from "antd";
// import * as Button from './components/button';
import { Container, Navbar, Nav, Row, Col, Image } from "react-bootstrap";
import history from "./history";
import Ionicon from "react-ionicons";
import "./style.scss";
import MailboxPopup from "./MailboxPopup";
import useSettingsDialog from "./useSettingsDialog";
import SettingsDialog from "./SettingsDialog";
import IconButton from "@material-ui/core/IconButton";
import BrushIcon from "@material-ui/icons/ColorLens";
import Guidance from "./Guidance";
//Reusable headerbar component
const HeaderBar = (props) => {
    const { settingsOpen, toggleSettings } = useSettingsDialog();
    return (
    <React.Fragment>
      <SettingsDialog open={settingsOpen} hide={toggleSettings} />
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
            justifyContent: "center",
            flexWrap: "nowrap"
          }}
        >
          <Col />
          <Col
            className="justify-content-md-center"
            xs={11}
            style={{ textAlign: "center" }}
          >
            <Navbar.Brand
              className="navbarBrand"
              href="#"
              onClick={() => {
                history.push("/");
              }}
            >
              <Image
                src={require("./assets/images/logo_" +
                  localStorage.getItem("colorScheme") +
                  ".png")}
                style={{ height: 30, marginLeft: 5, marginBottom: 2 }}
              />
              Digital Learning
            </Navbar.Brand>
            <MailboxPopup />
          </Col>
          <Col style={{}}>
            <Nav className="mr-auto"></Nav>
            <div className="customiseButton">

            <IconButton
                aria-label="notifications"
                onClick={() => toggleSettings()}
                className="bell"
                >
                <BrushIcon fontSize="default" />
            </IconButton>    
            </div>
            {props.steps ? <div className="guidanceButton"><Guidance steps={props.steps} isTourOpen={props.isTourOpen}/> </div> : null}
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
  );
};

export default HeaderBar;
