import React from "react";
import "./style.scss";
import Ionicon from "react-ionicons";

/**
 * A reusable component for simple popup messages displaying 
 * a centred text (param)msg and a button at the top right corner
 * to close the popup box. Popup functions as a lightbox and will display in
 * front of all other components on the screen.
 * To use simply create a MessagePopup in the render section of the
 * parent container where you wish for this message to be displayed, defining
 * the state as appropriate
 * @param text = the string of the message to be displayed
*/ 
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