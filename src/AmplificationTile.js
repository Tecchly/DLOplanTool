import React from "react";
import { useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import Ionicon from "react-ionicons";
import Chip from "@material-ui/core/Chip";
import { makeStyles } from "@material-ui/core/styles";
import "./style.scss";
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
import theme from "./styling/theme.scss";
import Icon from "@material-ui/core/Icon";

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
      backgroundColor: theme.primary,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: "#fff"
      }
    }
  }
}))(MenuItem);
const AplificationTile = props => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentSelection, setCurrentSelection] = useState(null);
  const [selected, pushSelected] = useState({});
  const selectLimit =
    props.words && props.words.keywords
      ? props.words.keywords.length > 5
        ? 3
        : props.words.keywords.length === 1
        ? 1
        : Math.floor(props.words.keywords.length / 2)
      : 0;

  const addSelect = idea => {
    selected[idea] = {
      type: "basic amplification",
      keyword: props.words.keywords[idea],
      icon: "cancel"
    };
    pushSelected(selected);
  };
  const deleteSelect = idea => {
    delete selected[idea];
    pushSelected({ ...selected });
  };
  const setAmplificationType = (index, type, icon) => {
    selected[index].type = type;
    selected[index].icon = icon;

    handleClose();
  };
  function handleClick(event, index) {
    setAnchorEl(event.target);
    setCurrentSelection(index);
  }

  function handleClose(event) {
    setAnchorEl(null);
    setCurrentSelection(null);
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
                    selected && Object.keys(selected).length == selectLimit
                      ? { root: "amplificationDone", sizeSmall: "smallFab" }
                      : {
                          root: "amplificationDoneDisabled",
                          sizeSmall: "smallFab"
                        }
                  }
                  onClick={() => {
                    props.setAmplificationOptions(
                      props.words.title,
                      selected,
                      !props.last ? props.index + 1 : null
                    );
                  }}
                >
                  <DoneIcon fontSize={"small"} />
                </Fab>
              ) : null}
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
                  selected && selected[i] ? (
                    <Avatar
                      className="amplificationChipAvatar"
                      style={{
                        backgroundColor: theme.primary,
                        color: "#ffffff67"
                      }}
                    >
                      <Icon>{selected[i].icon}</Icon>
                    </Avatar>
                  ) : null
                }
                className={classes.chip}
                classes={
                  selected && selected[i]
                    ? { root: "chipClicked" }
                    : selected && Object.keys(selected).length == selectLimit
                    ? { root: "chipDisabled" }
                    : { root: "chipUnclicked" }
                }
                clickable
                onClick={event => {
                  return selected && selected[i]
                    ? deleteSelect(i)
                    : selected && Object.keys(selected).length < selectLimit
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
          <StyledMenuItem
            onClick={() =>
              setAmplificationType(currentSelection, "colour", "color_lens")
            }
          >
            <ListItemIcon>
              <ColorLensIcon />
            </ListItemIcon>
            <ListItemText primary="Colour" />
          </StyledMenuItem>
          <StyledMenuItem
            onClick={() =>
              setAmplificationType(
                currentSelection,
                "highlight",
                "format_paint"
              )
            }
          >
            <ListItemIcon>
              <FormatPaintIcon />
            </ListItemIcon>
            <ListItemText primary="Highlight" />
          </StyledMenuItem>
          <StyledMenuItem
            onClick={() =>
              setAmplificationType(currentSelection, "move", "control_camera")
            }
          >
            <ListItemIcon>
              <ControlCameraIcon />
            </ListItemIcon>
            <ListItemText primary="Move" />
          </StyledMenuItem>
          <StyledMenuItem
            onClick={() =>
              setAmplificationType(currentSelection, "enlarge", "zoom_out_map")
            }
          >
            <ListItemIcon>
              <ZoomIcon />
            </ListItemIcon>
            <ListItemText primary="Enlarge" />
          </StyledMenuItem>
        </StyledMenu>
      </Col>
      {/* {props.last || !(props.words && props.words.keywords) ? null : (
        <div className={props.active ? "outer" : "outerClosed"}>
          <div className={props.active ? "inner" : "innerClosed"}></div>
        </div>
      )} */}
    </Row>
  );
};
export default AplificationTile;
