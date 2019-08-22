import React, { useCallback, useContext } from "react";
import { withRouter, Redirect } from "react-router";
import firebase from "./Firebase";
import { AuthContext } from "./Auth.js";
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const Login = ({ history }) => {
    const uiConfig = {
        // Popup signin flow rather than redirect flow.
        signInFlow: 'popup',
        // We will display Google and Facebook as auth providers.
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            signInSuccessWithAuthResult: () => false
        }
      };

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <h1>My App</h1>
      <p>Please sign-in:</p>
      <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>
    </div>
  );
};

export default withRouter(Login);