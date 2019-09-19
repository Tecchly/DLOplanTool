import React from "react";
import { Row, Col } from "react-bootstrap";
import ContentLoader from "react-content-loader"
const ProjectLoader = () => {
    const MyLoader = () => (
        <ContentLoader 
          height={10}
          width={10}
          speed={2}
          primaryColor="#f3f3f3"
          secondaryColor="#ecebeb"
          style={{height: 300, width: 300, borderRadius: 17,float: 'left',marginRight: 20  }}
          >
          <rect x="0" y="0" rx="0" ry="0" width="10" height="10" />
        </ContentLoader>
      )
      const LoadingTiles= () => (
        <div>
          <MyLoader />
          <MyLoader />
        </div>
      )
    return (
        <LoadingTiles />
    )
} 
export default ProjectLoader;