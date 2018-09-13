import React, { Fragment } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

const ui = new firebaseui.auth.AuthUI(firebase.auth());
const uiConfig = {
  signInSuccessUrl: window.location.href,
  autoUpgradeAnonymousUsers: true,
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: false,
    },
    firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
  ],
  tosUrl: "https://github.com/jonikorpi/kausi/blob/master/TERMS_OF_SERVICE.md",
  privacyPolicyUrl:
    "https://github.com/jonikorpi/kausi/blob/master/PRIVACY_POLICY.md",
  callbacks: {
    // signInSuccessWithAuthResult: (authResult, redirectUrl) => true,
    signInFailure: error => {
      if (error.code === "firebaseui/anonymous-upgrade-merge-conflict") {
        console.warn(
          "Anonymous account upgrade merge conflict. Resolving this is not currently implemented."
        );
      }
      return Promise.resolve();
    },
  },
};

class FirebaseUI extends React.Component {
  componentDidMount() {
    ui.start("#firebaseui-auth-container", uiConfig);
  }
  render() {
    return <div id="firebaseui-auth-container" />;
  }
}

export default FirebaseUI;
