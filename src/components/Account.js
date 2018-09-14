import React from "react";
import firebase from "firebase/app";
import "firebase/auth";

class Account extends React.Component {
  state = {
    userID: null,
    userName: null,
    anonymous: null,
  };

  componentDidMount() {
    this.authSubscription = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const { uid, isAnonymous, email, providerData } = user;
        this.setState({
          userID: uid,
          userName: isAnonymous
            ? "Guest account"
            : email || (providerData && JSON.stringify(providerData)),
          anonymous: isAnonymous,
        });
      } else {
        this.setState({ userID: null, userName: null, anonymous: null }, () =>
          firebase.auth().signInAnonymously()
        );
      }
    });
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
    this.authSubscription();
  }

  signOut = () => firebase.auth().signOut();

  render() {
    const { signOut } = this;

    return this.props.children({ ...this.state, signOut });
  }
}

export default Account;
