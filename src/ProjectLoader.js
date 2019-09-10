import React from "react";
import { Row, Col } from "react-bootstrap";
import ContentLoader from "react-content-loader"
const ProjectLoader = () => {
    const MyLoader = () => (
        <Col style={{width: "25vh",
    
        height: 400,
    
        marginLeft: 10,
        marginRight: 10}}>
        
        <ContentLoader 
          height={10}
          width={10}
          speed={2}
          primaryColor="#f3f3f3"
          secondaryColor="#ecebeb"
          style={{position: 'absolute', height: 300, width: 300, borderRadius: 17}}
          >
          <rect x="0" y="0" rx="0" ry="0" width="10" height="10" />
        </ContentLoader>
          </Col>
      )
      const LoadingTiles= () => (
        <Row>
          <MyLoader />
          <MyLoader />
        </Row>
      )
    return (
        <LoadingTiles />
    )
} 
export default ProjectLoader;