import React from "react";
import { app } from "./Firebase";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Icon } from "antd";
import { withRouter, Redirect } from "react-router";
import { Container, Navbar, Nav, Row, Col, Image } from "react-bootstrap";
import "./index.css"
import Ionicon from "react-ionicons";
import Utils from "./Utils.js"


class IdeaCard extends React.Component {
    constructor(props) {
        super(props)
        //Props will have tile, mode and notes.
        
    }

    state = {
        title: "",
        mode: "",
        notes: "",
        level: 0,
        childIdeas: []
    };

    //For removing a child
    handleDelete = (uuid) => {
        //Seems to consistently delete from tail.
        console.log(this.state.childIdeas.filter(idea => idea !== uuid));
        this.setState({
            childIdeas: this.state.childIdeas.filter(idea => idea !== uuid)
          });        
          //Update the props on the children.
    }

    componentDidMount() {
        
        if (this.props.title){
            this.setState ({title: this.props.title});
        }

        if (this.props.mode) {
            this.setState({mode: this.props.mode});
        }

        if (this.props.level) {
            this.setState({level: this.props.level});
        }           

        //All others will be done with db calls.

        //Test,
        this.setState ({mode: "video"});
        this.setState({title: "Condensation"}); //@@TODO,need to fix text wrapping if text is too long here. 
        
    }

    componentWillReceiveProps(){
        
    }

    addChild(title) {
        if (this.state.childIdeas.length < 4){
            this.setState({
                childIdeas:[...this.state.childIdeas, title]
              });
        }
    }

    render() {

        return(
            <React.Fragment>
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
                        flexShrink:2
                        }}

                        onClick={()=> {
                            //@@TODO edit component menu.
                            
                        }}
                        >   
                        <div>
                            {this.state.mode}     

                           {this.state.level !== 0 ? <Ionicon
                            style={{
                                position: "relative",
                                height:"15%",
                                width:"15%",
                                left: "20%",
                                top: "0",
                                cursor: 'pointer',
                            }}
                            icon="md-close"
                            onClick={()=> {
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
                                position: "relative",
                                left: "40%", //@@TODO make this properly laid out.
                                top: "100%",
                                cursor: 'pointer',
                            }}
                            icon="md-add"
                            onClick={() => {
                                //should be mode
                                //Generate UUID for the node here and also pass to child components
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
                                        parentArray = {this.state.childIdeas}
                                        level={this.state.level+1}
                                        handleDelete = {this.handleDelete}></IdeaCard>)}
                    </div>
                </div>
            </React.Fragment>
            )
        
    }

}


export default withRouter(IdeaCard);