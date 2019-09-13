import React from "react";
import { useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import Ionicon from "react-ionicons";
import Chip from "@material-ui/core/Chip";
import { makeStyles } from "@material-ui/core/styles";
import ContentLoader from "react-content-loader";
import "./index.css";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap"
  },
  chip: {
    margin: theme.spacing(1)
  },
  chipClicked: {}
}));

const AplificationTile = props => {
  const [selected, pushSelected] = useState([]);
  const addSelect = idea => {
    // console.log(idea)
    // if ( selected && selected.length > 0 ) {
    //   var index = selected.indexOf(idea.toString());
    //   pushSelected(oldArray => {index == -1 && oldArray.length < 3  ? [...oldArray, idea] : [...oldArray.splice(index,1)]});
    // } else {
    //   pushSelected(oldArray => [...oldArray, idea]);
    // }
    pushSelected(oldArray => [...oldArray, idea]);
  };

  const [activeTile, updateActive] = useState(false);
  const setActive = () => {
    console.log('acti')
    updateActive(!activeTile);
  };
  const classes = useStyles();
  return (
    <Row style={{ marginLeft: "20%", marginRight: "20%" }}>
      <div className={activeTile? "ampTileChip" : "ampTileChipClosed"} onClick={() => setActive()}>
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
          activeTile ? "amplificationTile" : "amplificationTileClosed"
        }
      >
        {props.words ? (
          <Row className='amplificationTileTitleRow'>
            <h2>{props.words.title}</h2>
          </Row>
        ) : null}
        {activeTile && props.words && props.words.keywords
          ? props.words.keywords.map((x, i) => (
              <Chip
                key={i}
                label={x}
                className={classes.chip}
                classes={
                  selected.indexOf(i) >= 0
                    ? { root: "chipClicked" }
                    : { root: "chipUnclicked" }
                }
                clickable
                onClick={() => addSelect(i)}
              />
            ))
          : null}
      </Col>
      {props.last ? null : (
        <div className={activeTile ? "outer" : "outerClosed"}>
          <div className={activeTile ? "inner" : "innerClosed"}></div>
        </div>
      )}
    </Row>
  );
};
export default AplificationTile;
