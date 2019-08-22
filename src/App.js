import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import firebase from "firebase"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"

firebase.initializeApp({
  apiKey: "AIzaSyCECL6ZgVbIsw0FtRU6iLnI2bpiTQC7Sao",
  authDomain: "dloplantool.firebaseapp.com"
})

class App extends Component {
  state = {isSignedIn:false}
  uiConfig = {
    signInFlow: "popup",
    signInOptions:[
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccess: () => false
    }
  }

  componentDidMount = () => {
    

    firebase.auth().onAuthStateChanged(user => {
      this.setState({isSignedIn:!!user})
      console.log("user", user)
    })
  }

  render() {
    return (
      <div className="App">
        {this.state.isSignedIn ? ( 
          <span>
            <div>Signed In!</div>
            <button onClick={()=> firebase.auth().signOut()}>Log Out</button>
            <h1>Welcome {firebase.auth().currentUser.displayName}</h1>
            <img alt="profile picture" src={firebase.auth().currentUser.photoURL}/>
          </span>
        ):(  
        // <div>Not Signed In!</div>
        <StyledFirebaseAuth
          uiConfig={this.uiConfig}
          firebaseAuth={firebase.auth()}/>
    )}
      </div>
    );
  }
}

export default App;
