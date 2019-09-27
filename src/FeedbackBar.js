import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

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
  typography: {
    padding: theme.spacing(2),
  },
}));

export default function FeedbackBar() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [commend, setCommend] = React.useState();

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleCommend = event => {
      console.log(event.currentTarget.value);
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
        <Button onClick={handleCommend} value="mapping">Good Mapping</Button>
        <Button onClick={handleCommend} value="amplification">Good Amplification</Button>
        <Button onClick={handleCommend} value="personalsation">Good Personalisation</Button>
        <Button onClick={handleCommend} value="coherance">Good Coherance</Button>
      </Popover>
    </div>
  );
}
