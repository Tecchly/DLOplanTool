import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./Home";
import Projects from "./Projects";
import Feedback from "./Feedback";
import Login from "./Login";
import SignUp from "./SignUp";
import { AuthProvider } from "./Auth";
import PrivateRoute from "./PrivateRoute.js";
import Project from "./Project.js";

const App = () => {
  return (
    <AuthProvider>
      <Router>

          <PrivateRoute exact path="/" component={Home} />
          <PrivateRoute exact path="/projects" component={Projects} />
          <PrivateRoute exact path="/feedback" component={Feedback} />
          <Route exact path="/login" component={Login} id="login"/>
          <Route exact path="/signup" component={SignUp} />          
          <PrivateRoute exact path="/project" component={Project}/>
          
      </Router>
    </AuthProvider>
  );
};

export default App;