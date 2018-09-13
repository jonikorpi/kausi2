import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import * as firebaseui from "firebaseui";

// var ui = new firebaseui.auth.AuthUI(firebase.auth());
// const uiConfig = {
//   signInSuccessUrl: window.location,
//   autoUpgradeAnonymousUsers: true,
//   signInOptions: [
//     firebase.auth.GoogleAuthProvider.PROVIDER_ID,
//     firebase.auth.FacebookAuthProvider.PROVIDER_ID,
//     firebase.auth.TwitterAuthProvider.PROVIDER_ID,
//     firebase.auth.GithubAuthProvider.PROVIDER_ID,
//     firebase.auth.EmailAuthProvider.PROVIDER_ID,
//     firebase.auth.PhoneAuthProvider.PROVIDER_ID,
//     firebase.auth.AnonymousAuthProvider.PROVIDER_ID,
//   ],
//   tosUrl: "https://github.com/jonikorpi/kausi/blob/master/TERMS_OF_SERVICE.md",
//   privacyPolicyUrl:
//     "https://github.com/jonikorpi/kausi/blob/master/PRIVACY_POLICY.md",
// };
// ui.start('#firebaseui-auth-container', uiConfig);
// if (ui.isPendingRedirect()) {
//   ui.start("#firebaseui-auth-container", uiConfig);
// }

class Authentication extends React.Component {
  state = {
    userID: null,
    userName: null,
    anonymous: "true",
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const { uid, isAnonymous, email, providerData } = user;
        this.setState({
          userID: uid,
          userName: isAnonymous
            ? "Temporary account"
            : email || (providerData && JSON.stringify(providerData)),
          anonymous: isAnonymous,
        });
      } else {
        firebase.auth().signInAnonymously();
      }
    });
  }

  render() {
    return this.props.children(this.state);
  }
}

export default Authentication;
