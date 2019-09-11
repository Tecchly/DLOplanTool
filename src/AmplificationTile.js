import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import Ionicon from "react-ionicons";
import ContentLoader from "react-content-loader";
import "./index.css";
const AplificationTile = props => {
  return (
    <Row style={{ marginLeft: "20%", marginRight: "20%" }}>
      <div className={props.active ? "ampTileChip" : "ampTileChipClosed"}>
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
        fluid={false}
      ></Col>
      {props.last? null : 
      <div className={props.active ? "outer" : "outerClosed"}>
        <div className={props.active ? "inner" : "innerClosed"}></div>
      </div>
      }
    </Row>
  );
};
export default AplificationTile;
