import React from "react";
import firebase from "firebase/app";
import "firebase/firestore";

export default class Firestore extends React.Component {
  state = {};
  results = {};
  db = firebase.firestore();

  componentWillMount() {
    const queryMap = this.props.query(this.db);

    for (var key in queryMap) {
      this.results[key] = {
        loading: true,
        snapshot: null,
      };

      this.results[key].unsubscribe = queryMap[key].onSnapshot(snapshot => {
        this.setState({
          [key]: {
            snapshot: snapshot,
          },
        });
      });
    }

    this.setState(this.results);
  }

  componentWillUnmount() {
    for (var i in this.results) {
      this.results[i].unsubscribe();
    }
  }

  render() {
    const { children, query, ...props } = this.props;

    return children(this.state, props);
  }
}
