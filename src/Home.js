import React from "react";
import {app} from "./Firebase";

const Home = () => {
  return (
    <React.Fragment>
      <h1>Home</h1>
      <button onClick={() => app.auth().signOut()}>Sign out</button>
    </React.Fragment>
  );
};

export default Home;