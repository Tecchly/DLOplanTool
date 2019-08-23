import React from "react";
import {app} from "./Firebase";
import * as firebase from "firebase/app";

const Home = () => {
  return (
    <React.Fragment>
      <h1>Home</h1>
      <h2>Welcome {firebase.auth().currentUser.displayName}</h2>
      <img alt="profile picture" src={firebase.auth().currentUser.photoURL}/>
      <h3><button onClick={() => app.auth().signOut()}>Sign out</button></h3>
    </React.Fragment>
  );
};

export default Home;