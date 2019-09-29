import Tour from 'reactour';
import React from "react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import HelpIcon from '@material-ui/icons/Help';
import IconButton from "@material-ui/core/IconButton";

class Guidance extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isTourOpen: false
      };
    }
  
    componentDidMount() {
      window.addEventListener("keyup", this.keyHandling);
    }
  
    componentWillUnmount() {
      window.removeEventListener("keyup", this.keyHandling);
    }
  
    disableBody = target => disableBodyScroll(target);
    enableBody = target => enableBodyScroll(target);
  
    closeTour = () => {
      this.setState({ isTourOpen: false });
    };
  
    openTour = () => {
      this.setState({ isTourOpen: true });
    };

    toggleTour() {
        this.setState({isTourOpen: !this.state.isTourOpen})
    }
  
    render() {
      const { isTourOpen } = this.state;
      const accentColor = "#5cb7b7";
      return (
        <div>
            <IconButton
            aria-label="guidanceTour"
            onClick={() => this.toggleTour()}
            className="guidance"
            >
                <HelpIcon fontSize="default" />
            </IconButton>
            <Tour
                onRequestClose={this.closeTour}
                steps={this.props.steps}
                isOpen={isTourOpen}
                maskClassName="mask"
                className="helper"
                rounded={5}
                accentColor={accentColor}
                onAfterOpen={this.disableBody}
                onBeforeClose={this.enableBody}
            />
        </div>
      );
    }
  }
  
  export default Guidance;