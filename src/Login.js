import React, { useContext } from "react";
import { withRouter, Redirect } from "react-router";
import {app, provider} from "./Firebase";
import { AuthContext } from "./Auth.js";

const Login = ({ history }) => {
  function handleLogin (){
    app.auth().signInWithPopup(provider).then(function(result){        
    history.push("/");}).catch( function (error){
        alert(error);
      });
    };

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <h1>Log in</h1>
      <button onClick={handleLogin}> Log In</button>
    </div>
  );
};

export default withRouter(Login);