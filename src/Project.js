import React from "react";
import { app } from "./Firebase";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Icon } from "antd";
import { withRouter, Redirect } from "react-router";
import { Container, Navbar, Nav, Row, Col, Image } from "react-bootstrap";
import HeaderBar from "./HeaderBar.js"
import "./index.css"
import IdeaCard from "./IdeaCard.js"
import { maxWidth } from "@material-ui/system";
import Utils from "./Utils";
import firebase from "firebase";
import Firestore from "./Firestore.js";


class Project extends React.Component {
    
    constructor(props) {
        super(props);  
        //@@TODO find a good point to put saving.        
    }

    //Onload, load the idea object as a prop to all children. 
    state= {
        title:'',
        topic: '', 
        medium: '',
        availableModes: ["video","sound","writing","image"],
        loaded: false,
        ideas :{
            
        }
    }

    //Get changes from components,
    //@@TODO make slighltly different arrangements for root. Root change changes topic.
    handleIdeaUpdate = (uuid,data) =>{
        if (uuid==="root") {
            this.setState({topic: data.title});
            //Change field in DB too.
        }
        this.setState({
            ideas: {
                  ...this.state.ideas,
                  [`${uuid}`]: data
            }
        }, ()=> { 

            //@@Test for saving point. Make cleaner later
            var uid = firebase.auth().currentUser.uid;
            for (let idea in this.state.ideas) {
                //Saving of all ideas. 
                Firestore.saveIdeaToProject(uid,this.props.location.state.projectID,idea,this.state.ideas[idea]);
            }
        })
    }

    handleIdeaDeletion = (uuid) =>{
        const recursiveDelete = (uuid) => {
            for(let idea in this.state.ideas){
                if (this.state.ideas[idea].parentID == uuid){
                    recursiveDelete(idea);
                }
            }
            console.log("Deleted: " + uuid);
            var replacement = this.state.ideas;
            delete replacement[uuid];
            this.setState({
                ideas: replacement
            });
            var uid = firebase.auth().currentUser.uid;
            Firestore.deleteIdeafromProject(uid, this.props.location.state.projectID,uuid);

        }
        recursiveDelete(uuid);
        console.log(this.state.ideas);

    }
    
    //When loading.
    addIdea =(x)=>{
        var data= x.data();
        data.fromLoad = true; 
        this.setState({
            ideas: {
                  ...this.state.ideas,
                  [`${x.id}`]: data
            }
        })
    }


    componentDidMount() {
        this.setState({
            ideas: {
                  ...this.state.ideas,
                  root: {
                      title: this.props.location.state.topic,
                      parentID: "none",
                      mode : "video", //Get from a prop
                      notes: ""
                  }
            }
        });

        //this.props.location.state.projectID; Get project id.
        var ideas = Firestore.getAllIdeasByProject(firebase.auth().currentUser.uid,this.props.location.state.projectID); 
        ideas
        .get()
        .then(function(idea) {
             idea.forEach(x=>{
                 this.addIdea(x); 
            })
        }.bind(this)).then(function(){
            this.setState({loaded:true});
        }.bind(this));

        if (this.props.location.state.title) {
            this.setState({title: this.props.location.state.title});
        }

        if (this.props.location.state.topic) {
            this.setState({topic: this.props.location.state.topic});
        }        

        //@@TODO Medium select to control the available modes. 
        
        //get all ideas from DB if opening a previously saved project. 
    }


    componentWillUnmount() {
        
    }

    render() {
        return(
            <React.Fragment>
                <HeaderBar/>
                    <h1 style ={{
                        textAlign: "center"
                    }}
                    >
                        {this.state.title}
                    </h1>
                    <div style={{marginLeft: "15%", marginRight: "15%", maxWidth: "70%"}}>
                        {this.state.loaded ? <IdeaCard 
                            handleIdeaUpdate = {this.handleIdeaUpdate}
                            handleIdeaDeletion = {this.handleIdeaDeletion}
                            uuid = "root"
                            parentID = "none"
                            topic = {this.state.topic}
                            ideas = {this.state.ideas}
                            availableModes={this.state.availableModes}/> 
                            :null }
                    </div>                       
            </React.Fragment>          
        );
    }
}

export default withRouter(Project);