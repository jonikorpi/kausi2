import React, { Fragment } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import Loadable from "react-loadable";
import { Router, Link } from "@reach/router";

const Loading = ({ error, pastDelay }) =>
  pastDelay || error ? (
    <Fragment>
      {error ? (
        <pre>
          <code>{error.message}</code>
        </pre>
      ) : (
        "Loading authentication…"
      )}
    </Fragment>
  ) : null;

const FirebaseUI = Loadable({
  loader: () => import("../components/FirebaseUI"),
  loading: Loading,
  timeout: 30000,
});

class Authentication extends React.Component {
  state = {
    userID: null,
    userName: null,
    anonymous: null,
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
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
        this.setState(
          { userID: null, userName: null, anonymous: null, showUI: false },
          firebase.auth().signInAnonymously
        );
      }
    });
  }
  signOut = () => firebase.auth().signOut();

  render() {
    return (
      <Fragment>
        <Router>
          <FirebaseUI path="authenticate" />
        </Router>
        {this.props.children({
          ...this.state,
          UserUI: <UserUI {...this.state} />,
        })}
      </Fragment>
    );
  }
}

const UserUI = ({ userID, userName, anonymous }) => (
  <nav className="user">
    {userID ? (
      <Fragment>
        {userName}
        {anonymous ? (
          <Link to="authenticate">Sign in/Sign up</Link>
        ) : (
          <Link to="/">Sign out</Link>
        )}
      </Fragment>
    ) : (
      "Authenticating…"
    )}
  </nav>
);

export default Authentication;
