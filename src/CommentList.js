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
      var rec = {
        recommendation: comment,
        recommendationUser: firebase.auth().currentUser.displayName,
        recommendationTime: +new Date()
      }
      props.newRecommendation(rec);

      props.handleRecommendation(props.uuid, rec);

      setComment("");
    };
    

    return (
      <React.Fragment>
        <List component = "nav" style={{maxHeight:"250px", maxWidth:"400px", overflowY:"auto"}}>
          {Object.values(props.recommendations).map((item) => (
            <ListItem key={item.recommendationTime}>
            <ListItemText 
              primary = {item.recommendationUser} 
              secondary={item.recommendation}
              />
          </ListItem>
          ))} 
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