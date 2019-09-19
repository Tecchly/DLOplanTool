import React from 'react';
import { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Ionicon from "react-ionicons";
import Typography from '@material-ui/core/Typography';
import "./index.css";

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height:'100%',
    backgroundColor: theme.palette.background.paper,
  },
  ListItemText: {
      fontFamily: "Montserrat",
      fontSize: "24px"
  }
}));


export default function ModeSelectionMenu(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const options = props.availableModes;  

  useEffect(() => {
    setSelectedIndex(options.indexOf(props.currentMode)); 
  }); 

  function handleClickListItem(event) {
    setAnchorEl(event.currentTarget);
  }  
 
  function handleMenuItemClick(event, index) {
    setSelectedIndex(index);        
    props.handleModeChange(options[index]);
    setAnchorEl(null);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function modeToIcon(mode) {
        
        var icon = "";
        switch (mode){
            case "video":
                icon = "md-videocam";
                break;
            case "sound":
                icon = "ios-microphone-outline";
                break;
            case "writing":
                icon = "ios-paper";
                break;
            case "image":
                    icon = "ios-image";
                break;
            default:
                    icon = "ios-bulb";   
        }
            return icon;            
    }

   return (
    <div className={classes.root}>
      <List component="nav" aria-label="Mode mapping" 
        className = {options[selectedIndex]}>
        <ListItem
          button
          aria-haspopup="true"
          stye = {{
              width:"100%"
          }}
          onClick={handleClickListItem}
        >
        <ListItemIcon>
            <Ionicon
            fontSize="30"
            color="#fff"
            icon= {modeToIcon(options[selectedIndex])}
            />   
        </ListItemIcon>
          <ListItemText 
                disableTypography
                primary={<Typography type="body2" style={{ fontSize: '24px' }}>{options[selectedIndex]}</Typography>}
             />
        </ListItem>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option}
            selected={index === selectedIndex}
            onClick={event => handleMenuItemClick(event, index)}
          > 
            <ListItemIcon>
                <Ionicon
                fontSize="30"
                color="#666"
                icon= {modeToIcon(option)}
                />
            </ListItemIcon>                      
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
