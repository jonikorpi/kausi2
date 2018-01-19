import React from "react";
import ReactDOM from "react-dom";
import firebase from "firebase/app";
import "firebase/firestore";
// import registerServiceWorker from "./registerServiceWorker";

import App from "./components/App";

import "./reset.css";
import "./globals.css";
import "./components.css";

firebase.initializeApp({
  apiKey: "AIzaSyDxdJtakfnCuvAJZDBtzLUkOBhOaYfkEEE",
  authDomain: "kausi-dev.firebaseapp.com",
  databaseURL: "https://kausi-dev.firebaseio.com",
  projectId: "kausi-dev",
  storageBucket: "kausi-dev.appspot.com",
  messagingSenderId: "373784324590",
});

firebase
  .firestore()
  .enablePersistence()
  .then(() => {
    ReactDOM.render(<App />, document.getElementById("root"));
  })
  .catch(error => {
    if (error.code === "failed-precondition") {
      console.warn("Offline mode only works in one tab at a time.");
    } else if (error.code === "unimplemented") {
      console.warn("Browser doesn't support offline mode.");
    }

    ReactDOM.render(<App />, document.getElementById("root"));
  });

// registerServiceWorker();
