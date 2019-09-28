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

const useStyles = makeStyles(theme => ({
  root: {
    marginLeft: "10%",
    marginRight: "10%",
    textAlign: "center",
  },
  button: {
      marginLeft:10,
      marginRight:10,
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

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleCommend = event => {
      //TODO handle toggling off.
      if (props.shared) {
        setCommend(event.currentTarget.value);

        //Handle the commendation, i.e sent to DB
        props.handleCommend(
            props.uuid,
            {commendation:event.currentTarget.value}
            )
      }     
  }

  const handleClose = () => {
    setAnchorEl(null);

  };

  useEffect(()=>{
    var m = 0;
    var a = 0; 
    var p = 0;
    var c = 0;
    
    //Commends by the user, updates on change
    //@@TODO, need to account for if commendations don't exists yet.
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

  const pluralise = (num) =>{
    if (num <= 1) {
      return "user"
    }else {
      return "users"
    }
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div className = {classes.root}>
      <Button aria-describedby={id} variant="contained"  className = {classes.button} onClick={handleClick}>
        {props.shared ? "Commend Idea": "Commendations"}
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
    </div>
  );
}
