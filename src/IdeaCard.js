import React from "react";
import { app } from "./Firebase";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Icon } from "antd";
import { withRouter, Redirect } from "react-router";
import { Container, Navbar, Nav, Row, Col, Image } from "react-bootstrap";
import "./index.css"
import Ionicon from "react-ionicons";


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

    componentDidMount() {
        
        if (this.props.title){
            this.setState ({title: this.props.title});
        }

        if (this.props.mode) {
            this.setState({mode: this.props.mode});
        }

        if (this.props.level) {
            this.setState({level: this.props.level});
            console.log(this.props.level);
        }

        //All others will be done with db calls.

        //Test,
        this.setState ({mode: "Video"});
        this.setState({title: "Condensation"}); //@@TODO,need to fix text wrapping if text is too long here.        
        
    }

    addChild(title) {
        if (this.state.childIdeas.length < 6){
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
                        flexShrink: 1
                        }}
                        >   
                        <div>
                            {this.state.mode}                    
                           <Ionicon
                            style={{
                                position: "relative",
                                height:"15%",
                                width:"15%",
                                left: "20%",
                                top: "0",
                                cursor: 'pointer',
                            }}
                            icon="md-close"
                            />
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
                                this.addChild("title");
                            }}
                            />:
                            null}   
                     
                    </div>
                                    
                    <div className="childIdeas" style ={{display:"flex",width:"100%",justifyContent:"space-evenly"}}>
                        {this.state.childIdeas.map((title, index) => <IdeaCard key={index} level={this.state.level+1}>{title}</IdeaCard>)}
                    </div>
                </div>
            </React.Fragment>
            )
        
    }

}


export default withRouter(IdeaCard);