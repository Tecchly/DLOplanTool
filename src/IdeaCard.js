import React from "react";
import { app } from "./Firebase";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Icon } from "antd";
import { withRouter, Redirect } from "react-router";
import { Container, Navbar, Nav, Row, Col, Image } from "react-bootstrap";
import "./index.css"
import Ionicon from "react-ionicons";
import Utils from "./Utils.js"
import IdeaEditPopup from "./IdeaEditPopup.js"
import { relative } from "path";


class IdeaCard extends React.Component {
    constructor(props) {
        super(props)
        //Props 
        //uuid- the uuid of this tile
        //parentID the uuid of this tiles parent //@@TODO need to make this an array of parents to root for saving. 
    }

    state = {
        title: "",
        mode: "",
        created: false,
        notes: "",
        level: 0,
        childIdeas: [], //Maybe store as an associative array.
        editing:false
    };

    //For removing a child
    handleDelete = (uuid) => {
        console.log(this.state.childIdeas.filter(idea => idea !== uuid));
        this.setState({
            childIdeas: this.state.childIdeas.filter(idea => idea !== uuid)
          });        
          //Update the props on the children.
    }

    //Handle the edit, then close the popup.
    handleEdit = (title, notes, mode) =>{
        //Set as created.
        this.setState({title:title});
        this.setState({notes:notes});
        this.setState({mode:mode});
        
        this.props.handleIdeaUpdate(this.props.uuid,{
            title: title,
            uuid: this.props.uuid,
            parentID: this.props.parentID,
            notes: notes,
            mode : mode
        });

        this.setState({created: true}, () => {
            this.closePopup()
        });
    }

    closePopup = () =>{
        this.setState({editing:false});

        if (!this.state.created) {
            this.props.handleDelete(this.props.uuid); 
        }       
    }

    componentDidMount() {
        //console.log(this.props);
        if (this.props.title){
            this.setState ({title: this.props.title});
        }

        if (this.props.mode) {
            this.setState({mode: this.props.mode});
        }

        if (this.props.level) {
            this.setState({level: this.props.level});
        }           

        if (this.props.level > 0) {
            this.setState({editing:true}); //Automatically open editing card if not root element. 
        }

        //Test,
        this.setState ({mode: "video"}); 
    }

    addChild(title) {
        if (this.state.childIdeas.length < 4){
            //Possibly also update project
            this.setState({
                childIdeas:[...this.state.childIdeas, title]
              });
        }
    }

    render() {
         return(
            <React.Fragment>
                {this.state.editing ? (
                //Popup will live here.
                <IdeaEditPopup 
                    title ={this.state.title} 
                    mode={this.state.mode} 
                    notes ={this.state.notes} 
                    handleEdit = {this.handleEdit}
                    uuid = {this.props.uuid}
                    handleDelete = {this.handleDelete}
                    availableModes= {this.props.availableModes}
                    closePopup = {this.closePopup}
                    />
                ) : null}
                <div>
                    <div style = {{
                        font:"Montserrat,sans-serif",
                        backgroundColor: "#ff0",
                        fontSize: "18px", 
                        textAlign:"center", 
                        width:"150px",
                        height:"100px",
                        borderRadius:"5px",
                        marginRight: "auto",
                        marginLeft: "auto",
                        marginTop:"1rem",
                        flexShrink:2,
                        position: "relative"
                        }}
                        >   
                        <div
                            className = {this.state.mode}
                            style = {{
                                cursor: 'pointer',
                            }}
                            onClick={()=> {
                                this.setState({editing:"true"});
                            }}>
                            
                            <Ionicon
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 10
                            }}
                            fontSize="30"
                            color="#fff"
                            icon="ios-bulb"
                            />

                            {this.state.mode}  

                            {this.state.level !== 0 ? <Ionicon
                            style={{
                                float:"right",
                                left: "15px",
                                top: "0",
                                cursor: 'pointer',
                            }}
                            icon="md-close"
                            onClick={(event)=> {
                                this.props.handleDelete(this.props.uuid);                                                        
                            }}
                            />: null}                
                        </div>

                        <div style = {{
                            fontSize:"20px"
                        }}>
                            {this.state.title}    
                        </div>     
      
                        {this.state.level < 3 ? 
                           <Ionicon
                            style={{
                                position: "absolute",
                                right:0,
                                bottom:0,
                                cursor: 'pointer',
                            }}
                            icon="md-add"
                            onClick={() => {
                                //Generate UUID for the node here and also pass to child component
                                var uuid = Utils.uuid();
                                this.addChild(uuid);
                            }}
                            />:
                            null}   
                    </div>
                                    
                    <div className="childIdeas" style ={{display:"flex",width:"100%",justifyContent:"space-evenly"}}>
                        {this.state.childIdeas.map((uuid) =>
                             <IdeaCard  key={uuid} 
                                        uuid = {uuid}
                                        handleIdeaUpdate = {this.props.handleIdeaUpdate}
                                        parentID = {this.props.uuid} //@@TODO Make this an array of all the parents
                                        availableModes={this.props.availableModes}
                                        level={this.state.level+1}
                                        handleDelete = {this.handleDelete}></IdeaCard>)}
                    </div>
                </div>
            </React.Fragment>
            )
        
    }

}


export default withRouter(IdeaCard);