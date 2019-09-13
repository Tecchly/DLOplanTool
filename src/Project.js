import React from "react";
import { app } from "./Firebase";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Icon } from "antd";
import { withRouter, Redirect } from "react-router";
import { Container, Navbar, Nav, Row, Col, Image } from "react-bootstrap";
import HeaderBar from "./HeaderBar.js"
import "./index.css"
import "orgchart/src/css/jquery.orgchart.css"

import $ from "jquery";
const orgchart = require("orgchart");

class Project extends React.Component {
    
    constructor(props) {
        super(props);        

        //@@TODO check if the props have been passed, if not then get them from DB
        
    }

    componentDidMount() {
        this.$el = $(this.el);

        //Data will be what each node will contain. 
        var nodeTemplate = function(data) {
            return `<div class="title">${data.name}</div>
            <div class="content">${data.title}</div>` ;
        }
        
        //Populate this from DB if it exists
        this.datasource = {
            'data-id': 1,
            'name': 'Video',
            'title': 'Water Cycle',
            'description': 'why the rain be wet?',
            'className' : 'video',
            'children': [
              { 'data-id':2, 'name': 'Image', 'title': 'The wet rain', 'className':'image',
                'children': [
                  { 'data-id': 3, 'name': 'Ren Wu', 'title': 'senior engineer' },
                ]
              },
              { 'data-id':4, 'name': 'Su Miao', 'title': 'department manager' ,
                'children': [
                  { 'data-id':5, 'name': 'Xing An', 'title': 'senior engineer' },
                ]
              }
            ]
        }

        var chart =this.$el.orgchart({
            'data' : this.datasource,
            'nodeContent': 'title',
            'nodeTemplate': nodeTemplate,
        });

        
        chart.$chartContainer.on('click', '.node', function() {
            var $this = $(this);
            //@@TODO open a popup and pass the relvant node's information as a prop
            //on popup exit the node will be changed.

            console.log($this[0]);
            //Remove the other modes and add the relevant one
            $this[0].classList.remove("video");
            $this[0].classList.remove("sound");
            $this[0].classList.remove("image");
            $this[0].classList.remove("text");

            //Change mode            
            $this[0].classList.add("video");

            //Change title text like this. 
            $this.find('.title')[0].innerText = "change Mode";
            $this.find(".content")[0].innerText = "change content";
        });
    }


    //Generate a uuid
    uuidv4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        )
    }

    componentWillUnmount() {
        this.$el.empty();
    }

    state = {

    };
    render() {
        return(
            <React.Fragment>
                <HeaderBar/>
                <div id="chart-container" ref={el => this.el = el}></div>
            </React.Fragment>          
        );
    }
}

export default withRouter(Project);