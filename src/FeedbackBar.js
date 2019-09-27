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
}));

const StyleTooltip = withStyles(theme => ({
    tooltip: {
      fontSize: theme.typography.pxToRem(16),
    },
  }))(Tooltip);


//Need to pass in prop of commends
export default function FeedbackBar() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [commend, setCommend] = React.useState();

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleCommend = event => {
      console.log(event.currentTarget.value);
      setCommend(event.currentTarget.value);
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div className = {classes.root}>
      <Button aria-describedby={id} variant="contained"  className = {classes.button} onClick={handleClick}>
        Commend Project
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
        <StyleTooltip placement = "top" title="thought this was a good mapping">
            <Button onClick={handleCommend} value="mapping">
                <Map/>
            </Button>
        </StyleTooltip>
        <StyleTooltip placement = "top" title="thought this was a good amplification">
            <Button onClick={handleCommend} value="amplification">
                <VolumeUp/>
            </Button>
        </StyleTooltip>   
        <StyleTooltip placement = "top" title ="thought this was good personalization">
            <Button onClick={handleCommend} value="personalsation">
                <Face/>
            </Button>
        </StyleTooltip>
        <StyleTooltip placement = "top" title = "thought this was very coherent with the project">
            <Button onClick={handleCommend} value="coherance">
                <Autorenew/>
            </Button>
        </StyleTooltip>    
      </Popover>
    </div>
  );
}
