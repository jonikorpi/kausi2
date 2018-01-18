import React from "react";
import ReactDOM from "react-dom";
import firebase from "firebase/app";
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

ReactDOM.render(<App />, document.getElementById("root"));
// registerServiceWorker();
