import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';

import Button from '@material-ui/core/Button';
import Map from "@material-ui/icons/Map";
import Face from "@material-ui/icons/Face";
import Autorenew from "@material-ui/icons/Autorenew";
import VolumeUp from "@material-ui/icons/VolumeUp";
import Tooltip from '@material-ui/core/Tooltip';

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


//Need to pass in prop of commends
//Also needs a handler to save commends to DB.
export default function FeedbackBar(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [commend, setCommend] = React.useState();

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleCommend = event => {
      //TODO handle toggling off.
      if (props.shared) {
        setCommend(event.currentTarget.value);

        //Handle the commendation
        props.handleCommend(
            props.uuid,
            {commndation:event.currentTarget.value}
            )
      }     
  }

  const handleClose = () => {
    setAnchorEl(null);
    //Send the commendation to DB

  };

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
        <StyleTooltip placement = "top" title=" thought this idea is a good mapping">
            <Button onClick={handleCommend} value="mapping" className = {commend === "mapping"? classes.selected : null}>
                <Map/>
            </Button>
        </StyleTooltip>
        <StyleTooltip placement = "top" title=" thought this idea has good amplification">
            <Button onClick={handleCommend} value="amplification" className = {commend === "amplification"? classes.selected : null}>
                <VolumeUp/>
            </Button>
        </StyleTooltip>   
        <StyleTooltip placement = "top" title =" thought this idea has good personalization">
            <Button onClick={handleCommend} value="personalisation" className = {commend === "personalisation"? classes.selected : null}>
                <Face/>
            </Button>
        </StyleTooltip>
        <StyleTooltip placement = "top" title = " thought this idea is very coherent with the project">
            <Button onClick={handleCommend} value="coherence" className = {commend === "coherence"? classes.selected : null}>
                <Autorenew/>
            </Button>
        </StyleTooltip>    
      </Popover>
    </div>
  );
}
