import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import { useState, useEffect } from "react";
import Button from '@material-ui/core/Button';
import Map from "@material-ui/icons/Map";
import Face from "@material-ui/icons/Face";
import Autorenew from "@material-ui/icons/Autorenew";
import VolumeUp from "@material-ui/icons/VolumeUp";
import Tooltip from '@material-ui/core/Tooltip';
import firebase from "firebase";
import Badge from '@material-ui/core/Badge';
import CommentList from './CommentList.js'


const useStyles = makeStyles(theme => ({
  root: {
    marginLeft: "10%",
    marginRight: "10%",
    textAlign: "center",
  },
  button: {
      marginLeft:10,
      marginRight:10,
      fontSize: "12px",
  },
  selected: {
      backgroundColor: "#1fbf6c",
      '&:hover': {
        background: "#32CD32",
     },
  }, 
}));

const StyleTooltip = withStyles(theme => ({
    tooltip: {
      fontSize: theme.typography.pxToRem(16),
    },
  }))(Tooltip);


export default function FeedbackBar(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [commend, setCommend] = React.useState();

  const [mapping, setMapping] = React.useState(0);
  const [amplification, setAmplification] = React.useState(0);
  const [personalisation, setPersonalisation] = React.useState(0);
  const [coherence, setCoherance] = React.useState(0);

  //Feedback
  const [feedEl,setFeedEl] = React.useState(null);


  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };


  const handleClose = () => {
    setAnchorEl(null);
  };


  const feedbackClick = event => {
    setFeedEl(event.currentTarget);
  }

  const feedbackClose = () => {
    setFeedEl(null);
  }

  const handleCommend = event => {
      //TODO handle toggling off.
      if (props.shared) {
        setCommend(event.currentTarget.value);

        //Handle the commendation, i.e sent to DB
        props.handleCommend(
            props.uuid,
            {
              commendation:event.currentTarget.value, 
              commendUser: firebase.auth().currentUser.displayName,
              commendTime: +new Date()
            }
            )
      }     
  }

  useEffect(()=>{
    var m = 0;
    var a = 0; 
    var p = 0;
    var c = 0;
    
    //Commends by the user, updates on change
    var uid = firebase.auth().currentUser.uid;
    if (commend === undefined && uid in props.commendations) {
      setCommend(props.commendations[uid].commendation);
    }

    switch(commend){
      case "mapping":
        m=1;
        break;
      case "amplification":
        a=1;
        break;
      case "personalisation":
        p=1;
        break;
      case "coherence":
        c=1;
        break;
    }

    //Commends by other users, only updates on refresh.
    for (var idea in props.commendations) {
      if (uid !== idea) {
        var commendType = props.commendations[idea].commendation;

        switch(commendType){
          case "mapping":
            m++;
            break;
          case "amplification":
            a++;
            break;
          case "personalisation":
            p++;
            break;
          case "coherence":
            c++;
            break;
        }
      }
    } 
    
      setMapping(m);
      setAmplification(a);
      setPersonalisation(p);
      setCoherance(c);
  });

  //Cute function for gramatical correctness
  const pluralise = (num) =>{
    if (num === 1) {
      return "person"
    }else {
      return "people"
    }
  }

  const commendationPlural = (num) =>{
    if (num === 1) {
      return " commendation"
    } else {
      return " commendations"
    }
  }
  //commendation popover
  const open = Boolean(anchorEl);
  const id = open ? 'commend-popover' : undefined;

  //feedback popover
  const feedOpen = Boolean(feedEl);
  const feedID = open ? 'feedback-popover' :undefined;

  return (
    <div className = {classes.root}>
      <Badge 
        color="primary" 
        invisible={anchorEl===null}
        badgeContent={(Object.keys(props.commendations).length+ (commend ? 1:0)) + commendationPlural(Object.keys(props.commendations).length)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        >
        <Button aria-describedby={id} variant="contained"  className = {classes.button} onClick={handleClick}>
          {props.shared ? "Commend Idea": "Commendations"}
        </Button>      
      </Badge>
      <Button aria-describedby={feedID} variant="contained" className = {classes.button} onClick={feedbackClick}>
        {props.shared ? "Comment": "Comments"}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <StyleTooltip placement = "top" title= {mapping +  " " + pluralise(mapping) +" thought this idea is a good mapping"}>
            <Button onClick={handleCommend} value="mapping" className = {commend === "mapping"? classes.selected : null}>
                  <Map/>
            </Button>
        </StyleTooltip>
        <StyleTooltip placement = "top" title={amplification + " " +pluralise(amplification) + " thought this idea has good amplification"}>
            <Button onClick={handleCommend} value="amplification" className = {commend === "amplification"? classes.selected : null}>
                <VolumeUp/>
            </Button>
        </StyleTooltip>   
        <StyleTooltip placement = "top" title ={personalisation + " " + pluralise(personalisation) + " thought this idea has good personalisation"}>
            <Button onClick={handleCommend} value="personalisation" className = {commend === "personalisation"? classes.selected : null}>
                <Face/>
            </Button>
        </StyleTooltip>
        <StyleTooltip placement = "top" title = {coherence + " " + pluralise(personalisation) + " thought this idea is very coherent with the project"}>
            <Button onClick={handleCommend} value="coherence" className = {commend === "coherence"? classes.selected : null}>
                <Autorenew/>
            </Button>
        </StyleTooltip>    
      </Popover>

      <Popover
        id={feedID}
        open={feedOpen}
        anchorEl={feedEl}
        onClose={feedbackClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}>
          <CommentList
            uuid = {props.uuid}
            recommendations = {props.recommendations}
            handleRecommendation={props.handleRecommendation}
            newRecommendation={props.newRecommendation}
          />
        </Popover>
      
    </div>
  );
}
