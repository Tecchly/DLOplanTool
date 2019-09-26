import React from "react";
import "./index.css";
import Ionicon from "react-ionicons";

class MessagePopup extends React.Component {

    render() {
        return (
            <div className="messagePopup">
            <div className="messagePopup_inner">
                <Ionicon
                style={{
                    position: "absolute",
                    right: "15px",
                    top: "15px",
                    cursor: 'pointer',
                }}
                icon="md-close"
                onClick={this.props.closeMessagePopup}
                />
                {this.props.text}
            </div>
            </div>
        );
    }
}
export default MessagePopup;