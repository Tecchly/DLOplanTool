import React from "react";
import {app} from "./Firebase";



const Home = () => {
  return (
    <React.Fragment>
      <h1>Home</h1>
      <h2>{app.auth().currentUser.displayName}</h2>
      <img alt="profile" src={app.auth().currentUser.photoURL}/>
      <h3><button onClick={() => app.auth().signOut()}>Sign out</button></h3>
    </React.Fragment>
  );
};

export default Home;