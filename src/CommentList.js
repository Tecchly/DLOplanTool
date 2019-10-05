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


const useStyles = makeStyles(theme => ({
  root: {
    marginLeft: "10%",
    marginRight: "10%",
    textAlign: "center",
  },
}));

const StyleTooltip = withStyles(theme => ({
    tooltip: {
      fontSize: theme.typography.pxToRem(16),
    },
  }))(Tooltip);

export default function CommentList(props) {
    const classes = useStyles();
    const [comment, setComment] = React.useState("");


    const handleChange = event =>{
      if (event.currentTarget.value.length<140){
        setComment(event.currentTarget.value);
      }      
    }


    const handleClick = () => {

      props.handleRecommendation(
        props.uuid,
        {
          recommendation: comment,
          recommendationUser: firebase.auth().currentUser.displayName,
          recommendationTime: +new Date()
        }
      )
      setComment("");
      //@@TODO, push the comments into the view.
    };


    return (
      <React.Fragment>
        <List component = "nav">
          <ListItem>
            <ListItemText 
              primary = "User1" 
              secondary="comment"
              />
          </ListItem>
        </List>
        <div style={{display:"block", paddingLeft:5,paddingRight:5}}>
            <textarea 
              onChange = {handleChange}
              style={{width:"100%"}}
              value = {comment}
              >
            </textarea>
            <Button variant="contained" onClick = {handleClick} style={{marginBottom:5}}>
              Comment
            </Button>
        </div>
         
      </React.Fragment>
      

    )
}