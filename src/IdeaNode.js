import React from "react";
import { app } from "./Firebase";
import "./index.css";
import { Button, Icon } from "antd";
import { withRouter, Redirect } from "react-router";


class IdeaNode extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log("wat");
    }

    render() {
        return (
            <React.Fragment>
                <button onClick={()=>{
                    console.log("nice");
                }}>
                </button>

            </React.Fragment>
        );
    }
}

export default withRouter(IdeaNode);