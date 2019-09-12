import React, { createElement } from "react";
import interact from 'interactjs'
import { app } from "./Firebase";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Icon } from "antd";
// import * as Button from './components/button';
import { Container, Navbar, Nav, Row, Col, Image } from "react-bootstrap";
import IdeaNode from "./IdeaNode.js"
import history from "./history";
import Ionicon from "react-ionicons";
import "./index.css";
import useEffect from "react";
import P1 from "../assets/images/poster1.jpg";
import P2 from "../assets/images/poster2.jpg";
import P3 from "../assets/images/poster3.png";
import P4 from "../assets/images/poster4.png";
import { useState } from "react";

function dragMoveListener (event) {
  var target = event.target
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
  var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

  // translate the element
  target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)'

  // update the posiion attributes
  target.setAttribute('data-x', x)
  target.setAttribute('data-y', y)
}

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

function handleFormReset(e) {
  // Reset some form data
}

const Home = ({ history }) => {
  // const classes = useStyles();
  const classes = useStyles();
  var mainIdeas = [];
  var ideaCenter = null;
  var startPos = null;
  var testStuff = null;      

  interact('.mode')
  .draggable({
      // enable inertial throwing
      // inertia: false,
      // // keep the element within the area of it's parent
      // modifiers: [
      //     interact.modifiers.restrictRect({
      //     restriction: 'parent',
      //     endOnly: true
      //     }),
      //     interact.modifiers.snap({
      //         // snap to the corners of a grid
      //         targets: [(x, y) => {
      //             return {
      //                 x: 500,
      //                 y,
      //             };
      //           }]
      //     })
      snap: {
          targets: [startPos],
          range: Infinity,
          relativePoints: [ { x: 0.5, y: 0.5 } ],
          endOnly: true
      },
      onstart: function (event) {
          var original = event.target;
          
          if (original.getAttribute("clonable")==="true") {
            var clone = event.target.cloneNode(true);
            var x = clone.offsetLeft;
            var y = clone.offsetTop;
            clone.setAttribute('clonable',true);
            original.setAttribute('clonable', false);
            
            clone.style.position = "absolute";
            clone.style.left = original.offsetLeft+"px";
            clone.style.top = original.offsetTop+"px";
            original.parentElement.appendChild(clone);
          }

          var rect = interact.getElementRect(event.target);
          var el   = document.getElementById(event.target.id); // or other selector like querySelector()
          var rect2 = el.getBoundingClientRect(); // get the bounding rectangle
          var width = rect2.width;
          var height = rect2.height;
          // console.log( parseInt(width ));
          // console.log( parseInt(height ));

          // console.log( parseInt(width / 2 ));
          // console.log( parseInt(height / 2 ));

          // console.log( parseInt(rect2.left ));
          // console.log( parseInt(rect2.top ));
          // var cx = rect2
          // var cx = rect2.left + rect2.width/2, cy = rect2.top + rect2.height/2;
          // console.log( parseInt(cx ));
          // console.log( parseInt(cy ));

          // var radius = width / 2;

          // x2 + y2 = radius
          startPos = {
              x: rect.left + rect.width  / 2,
              y: rect.top  + rect.height / 2
              // x: cx,
              // y: cy
          }
          testStuff = {
              x: rect2.left + (width),
              y: rect2.top + height
          }
          var dropzoneElement  = event.target,
              dropRect         = interact.getElementRect(dropzoneElement),
              dropCenter       = {
              x: dropRect.left + dropRect.width  / 2,
              y: dropRect.top  + dropRect.height / 2
          };
          // event.draggable.draggable({
          //     snap: {
          //       targets: [dropCenter]
          //     }
          // });
          // dropzoneElement.classList.add('can--catch');
          // draggableElement.classList.add('drop--me');
          //console.log(dropCenter);
          // console.log(testStuff);
          // console.log("Y:", y);
  
          event.interactable.draggable({
          snap: {
              targets: [dropCenter]
          }
          });
      },
      // call this function on every dragmove event
      onmove: function (event) {
          console.log("Moving!" + event.target.id);
          var target = event.target,
              // keep the dragged position in the data-x/data-y attributes
              x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
              y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
  
          // translate the element
          target.style.webkitTransform =
          target.style.transform =
          'translate(' + x + 'px, ' + y + 'px)';
  
          // update the posiion attributes
          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
          target.classList.add('getting--dragged');
      },
      onend: function (event) {
          if (event.relatedTarget === null) {
            event.target.parentElement.removeChild(event.target);
          }       
          
          event.interactable.draggable({
              snap: {
                  targets: [startPos]
              }
          });
          event.target.classList.remove('getting--dragged')
          // console.log(interact.getElementRect(event.target));
      },
      // ondrop:
      // ],
      // enable autoScroll
      // autoScroll: true,

      // call this function on every dragmove event
      // onmove: dragMoveListener
  });

  interact(".droppable").dropzone({
    accept:".mode",
    overlap: 0.5,

    ondragenter: function (event) {
      var draggableElement = event.relatedTarget;
      var dropzoneElement = event.target;
      
      //Main ideas
      if (dropzoneElement.id === "main" && mainIdeas.length < 6) {
        var dropRect  = interact.getElementRect(dropzoneElement);
        var dropPoint = {
          x: dropRect.left + dropRect.width / 2,
          y: dropRect.top  + dropRect.height
        };

        event.draggable.draggable({
          snap: {
            targets: [dropPoint],
          }
        });
      }

    },

    ondragleave: function(event) {
      //Not needed yet.
      //@@TODO state when dragged out of outer ring and not in any rings, should delete.  
    },  

    ondrop: function (event) {
      //Get the dropped item and set a flag to what ring its in.
      event.relatedTarget.setAttribute("parentLayer", event.target.id); 

      //Cursed
      event.relatedTarget.setAttribute("class", "setMode");
      interact(".setMode").unset(); 

      if (event.target.id === "main" && mainIdeas.length < 6) {
        mainIdeas.push(event.relatedTarget);

        //change position of all so its nicely distributed
        var angle = 2 * Math.PI / mainIdeas.length;
        
        var dropRect = interact.getElementRect(event.target);
        var radius = dropRect.width / 2;

        ideaCenter = {
          x: dropRect.left + radius,
          y:dropRect.top - radius
        }

        var center = {
          x: parseFloat(event.relatedTarget.getAttribute('data-x')) || 0, 
          y: parseFloat(event.relatedTarget.getAttribute('data-y')) - radius || 0
        }
        //Each node has a reference of its transformation to the centre
        event.relatedTarget.setAttribute("centerX",center.x); 
        event.relatedTarget.setAttribute("centerY",center.y);
        
        var ideaIndex = 0;

        mainIdeas.forEach(element => {
          var newX = radius * Math.sin (angle * ideaIndex) + parseFloat(element.getAttribute("centerX"));
          var newY = radius * Math.cos (angle * ideaIndex) + parseFloat(element.getAttribute("centerY"));

          ideaIndex++;
          element.setAttribute('data-x', newX);
          element.setAttribute('data-y', newY);        

          element.style.webkitTransform =
           element.style.transform =
            'translate(' + newX + 'px, ' + newY + 'px)'
        });
      }
      console.log(event.relatedTarget.id
          + ' was dropped into '
          + event.target.id)
      }
    })
    .on('dropactivate', function (event) {
      event.target.classList.add('drop-activated');
  }.bind(this));

  const distributeNodes = ()=> {
    if (mainIdeas.length === 0) {
      return;
    }
  }

  React.useEffect(() => {
    const handleResize = () => {
      distributeNodes();
    }
    window.addEventListener('resize', handleResize);
  });

  const ProjectTile = ({ image }) => (
    <Col
      className={classes.recentProject}
      style={{
        backgroundImage: `url(${image})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        padding: 0
      }}
    >
      <Container fluid className={classes.projectOverlay}>
        <Container style={{ position: "absolute", bottom: 5 }}>
          <Row>
            <h2 className={classes.title}>Project Title</h2>
          </Row>
          <Row>
            <h3 className={classes.subtitle}>Project Subtitle</h3>
          </Row>
        </Container>
      </Container>
    </Col>
  );

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
                src={require("../assets/images/orange_logop.png")}
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
      <div style={{textAlign: "center", height: '750px', maxWidth: '1200px', minWidth: '1200px', overflow:'auto',overlowX:'auto',marginLeft:'100px',marginTop:"100px"}}>
        <svg height = '100%' width = '100%'>
            <circle className="droppable" stroke="#000" r="35%" id="tertiary" cy="50%" cx="50%" strokeWidth="1.5" fill="#fff"/>
            <circle className="droppable" stroke="#000" r="25%" id="secondary" cy="50%" cx="50%" strokeWidth="1.5" fill="#fff"/>
            <circle className="droppable" stroke="#000" r="15%" id="main" cy="50%" cx="50%" strokeWidth="1.5" fill="#fff"/>
            {/* <clipPath id="myCircle">
                <circle cx="50%" cy="50%" r="125" fill="#FFFFFF" />
            </clipPath> */}
            {/* <image y="40%" x="40%" width="20%" xlinkHref={P1} clip-path="url(#myCircle)" /> */}
            
            
            <circle className="mode" stroke="#000" r="2%" id="video" cy="90%" cx="3%" strokeWidth="1.5" fill="red" clonable = "true"/>
            <circle className="mode" stroke="#000" r="2%" id="sound" cy="90%" cx="8%" strokeWidth="1.5" fill="pink" clonable = "true"/>
            <circle className="mode" stroke="#000" r="2%" id="image" cy="90%" cx="13%" strokeWidth="1.5" fill="purple" clonable = "true"/>
            <circle className="mode" stroke="#000" r="2%" id="text" cy="90%" cx="18%" strokeWidth="1.5" fill="navy" clonable = "true"/>
        </svg>
    </div>
    </React.Fragment>
  );
};

export default Home;