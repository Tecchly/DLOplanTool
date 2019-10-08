import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useState, useEffect } from "react";
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import firebase from "firebase";
import moment from "moment";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";


const useStyles = makeStyles(theme => ({
  root: {
    marginLeft: "10%",
    marginRight: "10%",
    textAlign: "center",
  },
}));

//@@TODO make the list scrollable after a point

export default function CommentList(props) {
    const classes = useStyles();
    const [comment, setComment] = React.useState("");

    const handleChange = event =>{
      if (event.currentTarget.value.length<140){
        setComment(event.currentTarget.value);
      }    
    }

    const handleClick = () => {

      if (comment.length > 0){
        var rec = {
          recommendation: comment,
          recommendationUser: firebase.auth().currentUser.displayName,
          recommendationTime: +new Date()
        }
        props.newRecommendation(rec);
  
        props.handleRecommendation(props.uuid, rec);
  
        setComment("");
       
      }   
    };
    
    useEffect(()=>{
      var element = document.getElementById("dummy");
      element.scrollIntoView();
    })

    return (
      <React.Fragment>
        <List component = "nav" style={{maxHeight:"250px", overflowY:"auto",width: 300}}>
          {Object.values(props.recommendations).map((item) => (
            <ListItem key={item.recommendationTime}>
            <ListItemText 
              style={{maxWidth:"300px"}}
              primary = {item.recommendationUser} 
              secondary={item.recommendation}
              />
              <p style={{float:"right"}}>
                {moment(item.recommendationTime).format("MMM Do YY")}
              </p>
          </ListItem>
          ))} 
          <div id="dummy"></div>
        </List>

        <div style={{display:"block", paddingLeft:5,paddingRight:5}}>
            <textarea 
              onChange = {handleChange}
              style={{width:"78%", borderColor: "#00000026", borderRadius: 6, float: 'left', marginBottom: 15,}}
              value = {comment}
              >
            </textarea>
            {/* <Button variant="contained" onClick = {handleClick} style={{marginBottom:5}}>
              Comment
            </Button> */}
            <IconButton
                aria-label="send"
                onClick = {handleClick}
                className="commentPlane"
                disabled={!comment}
              >
                <SendIcon fontSize="default" />
              </IconButton>
        </div>
         
      </React.Fragment>
    )
}