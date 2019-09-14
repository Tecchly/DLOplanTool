import React from "react";
import { useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import Ionicon from "react-ionicons";
import Chip from "@material-ui/core/Chip";
import { makeStyles } from "@material-ui/core/styles";
import "./index.css";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import FormatPaintIcon from "@material-ui/icons/FormatPaint";
import Avatar from "@material-ui/core/Avatar";
import ColorLensIcon from "@material-ui/icons/ColorLens";
import CancelIcon from "@material-ui/icons/Cancel";
import DoneIcon from "@material-ui/icons/Done";
import ControlCameraIcon from "@material-ui/icons/ControlCamera";
import ZoomIcon from "@material-ui/icons/ZoomOutMap";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap"
  },
  chip: {
    margin: theme.spacing(1)
  },
  chip2: {
    margin: theme.spacing(1)
  },
  chipClicked: {}
}));
const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5"
  }
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "top",
      horizontal: "left"
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right"
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(theme => ({
  root: {
    "&:focus": {
      backgroundColor: "#FA8231",
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: "#fff"
      }
    }
  }
}))(MenuItem);
const AplificationTile = props => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, pushSelected] = useState([]);
  const addSelect = idea => {
    pushSelected(oldArray => [...oldArray, idea]);
  };
  const deleteSelect = idea => {
    selected.splice(idea, 1);
    pushSelected([...selected]);
  };

  function handleClick(event, index) {
    console.log(index)
    setAnchorEl(event.target);
  }

  function handleClose() {
    setAnchorEl(null);
  }
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const classes = useStyles();
  return (
    <Row style={{ marginLeft: "20%", marginRight: "20%" }}>
      <div
        className={props.active ? "ampTileChip" : "ampTileChipClosed"}
        onClick={() => {
          props.parentCallback(props.index);
        }}
      >
        <Ionicon
          style={{
            position: "absolute",
            top: 9,
            left: 10
          }}
          fontSize="30"
          color="#fff"
          icon={props.icon}
        />
      </div>
      <Col
        className={
          props.active ? "amplificationTile" : "amplificationTileClosed"
        }
      >
        {props.words ? (
          <Row className="amplificationTileTitleRow">
            <Col>
              <h2>{props.words.title}</h2>
            </Col>
            <Col>
              {props.active ? (
                <Fab
                  size="small"
                  aria-label="add"
                  className={classes.chip2}
                  classes={
                    selected.length == 3
                      ? { root: "amplificationDone", sizeSmall: "smallFab" }
                      : {
                          root: "amplificationDoneDisabled",
                          sizeSmall: "smallFab"
                        }
                  }
                  onClick={() => {
                    !props.last ? props.parentCallback(props.index + 1) : null;
                  }}
                >
                  <DoneIcon fontSize={"small"} />
                </Fab>
              ) :
              null}
            </Col>
          </Row>
        ) : null}
        {props.active && props.words && props.words.keywords
          ? props.words.keywords.map((x, i) => (
              <Chip
                aria-describedby={id}
                key={i}
                label={x}
                avatar={
                  selected.indexOf(i) >= 0 ? (
                    <Avatar
                      style={{ backgroundColor: "#FA8231", color: "#ffffff67" }}
                    >
                      <CancelIcon />
                    </Avatar>
                  ) : null
                }
                className={classes.chip}
                classes={
                  selected.indexOf(i) >= 0
                    ? { root: "chipClicked" }
                    : selected.indexOf(i) == -1 && selected.length == 3
                    ? { root: "chipDisabled" }
                    : { root: "chipUnclicked" }
                }
                clickable
                onClick={() => {
                  selected.indexOf(i) >= 0
                    ? deleteSelect(selected.indexOf(i))
                    : selected.length < 3
                    ? (addSelect(i), handleClick(event, i))
                    : null;
                }}
              />
            ))
          : null}
        <StyledMenu
          id="customized-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          classes={{ paper: "popMenu" }}
        >
          <StyledMenuItem onClick={handleClose}>
            <ListItemIcon>
              <ColorLensIcon />
            </ListItemIcon>
            <ListItemText primary="Color" />
          </StyledMenuItem>
          <StyledMenuItem onClick={handleClose}>
            <ListItemIcon>
              <FormatPaintIcon />
            </ListItemIcon>
            <ListItemText primary="Highlight" />
          </StyledMenuItem>
          <StyledMenuItem onClick={handleClose}>
            <ListItemIcon>
              <ControlCameraIcon />
            </ListItemIcon>
            <ListItemText primary="Move" />
          </StyledMenuItem>
          <StyledMenuItem onClick={handleClose}>
            <ListItemIcon>
              <ZoomIcon />
            </ListItemIcon>
            <ListItemText primary="Enlarge" />
          </StyledMenuItem>
        </StyledMenu>
      </Col>
      {props.last ? null : (
        <div className={props.active ? "outer" : "outerClosed"}>
          <div className={props.active ? "inner" : "innerClosed"}></div>
        </div>
      )}
    </Row>
  );
};
export default AplificationTile;
