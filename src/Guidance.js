import Tour from '@rrrapha/reactour';
import React from "react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import HelpIcon from '@material-ui/icons/Help';
import IconButton from "@material-ui/core/IconButton";
import Firestore from './Firestore';
import firebase from 'firebase';
import { withRouter } from "react-router"

class Guidance extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isTourOpen: this.props.isTourOpen ? this.props.isTourOpen : false,
        goToStep: 0
      };
      this.localCache = window.localStorage;
    }
  
    isNew() {
      var open = false;
      var path = this.props.location.pathname;
      if (path === "/") {
        var userData = Firestore.getUser(firebase.auth().currentUser.uid);
        userData.then(doc => {
          if (!doc.exists) {
            open = true;
            Firestore.updateUserDetails();
            this.localCache.setItem("showProjectTour", true);
            // this.localCache.setItem("showAmplifyTour", true);
            // this.localCache.setItem("showSharedProjectsTour", true);
            // this.localCache.setItem("showYourProjectsTour", true);
          }
          if (open) {
            this.openTour();
          }
        }).catch(error => {
          console.log(error);
        });
      }
    } 

    componentDidMount() {
      window.addEventListener("keyup", this.keyHandling);
      if (!this.state.isTourOpen) {
        this.isNew();   
      }
      var path = this.props.location.pathname;
      if ( ( path === "/project" && this.localCache.getItem("showProjectTour")) 
                  || (this.localCache.getItem("showOtherGuide") && path === "/")
                  || (this.localCache.getItem("showAmplifyTour") && path === "/amplification") 
                  || (this.localCache.getItem("showYourProjectsTour") && path === "/sharedprojects") 
                  || (this.localCache.getItem("showSharedProjectsTour") && path === "/project" && (this.props.location.state? this.props.location.state.shared : false)) ) {
        this.openTour();
      } 
      if (this.localCache.getItem("showOtherGuide") && path === "/") {
        this.setState({goToStep : 7});
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
      console.log(this.props.goToStep);
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
                goToStep={this.state.goToStep > 0 ? this.state.goToStep : undefined}
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
  
  export default withRouter(Guidance);