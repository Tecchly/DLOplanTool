import Tour from '@rrrapha/reactour';
import React from "react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import HelpIcon from '@material-ui/icons/Help';
import IconButton from "@material-ui/core/IconButton";
import Firestore from './Firestore';
import firebase from 'firebase';

class Guidance extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isTourOpen: this.props.isTourOpen ? this.props.isTourOpen : false
      };
    }
  
    isNew() {
      var open = false;
      var userData = Firestore.getUserData(firebase.auth().currentUser.uid);
      userData.get().then(doc => {
        if (!doc.exists) {
          open = true;
          Firestore.updateUserDetails();
        }
        if (open) {
          this.openTour();
        }
      }).catch(error => {
        console.log(error);
      });
    }

    componentDidMount() {
      window.addEventListener("keyup", this.keyHandling);
      if (!this.state.isTourOpen) {
        this.isNew();   
      }
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