import React from "react";
import debounce from "lodash.debounce";
import { format } from "date-fns/esm";

import firestore from "../utilities/firestore.js";

const categorizeLine = line => {
  const words = line.split(" ");

  const yearly = words.filter(word => word.startsWith("#yearly")).length > 0;
  if (yearly) {
    return "yearly";
  }
  const monthly = words.filter(word => word.startsWith("#monthly")).length > 0;
  if (monthly) {
    return "monthly";
  }
  const weekly = words.filter(word => word.startsWith("#weekly")).length > 0;
  if (weekly) {
    return "weekly";
  }
  const daily = words.filter(word => word.startsWith("#daily")).length > 0;
  if (daily) {
    return "daily";
  }
  return "calendar";
};

class DayData extends React.Component {
  state = {};
  references = {};
  subscriptions = [];

  componentDidMount() {
    const { day, userID } = this.props;
    const user = firestore.collection("users").doc(userID);

    this.references = {
      yearly: user.collection("repeating").doc(format(day, "MM-dd")),
      monthly: user.collection("repeating").doc(format(day, "dd")),
      weekly: user.collection("repeating").doc(format(day, "EEEE")),
      daily: user.collection("repeating").doc("daily"),
      calendar: user.collection("calendar").doc(format(day, "YYYY-MM-dd")),
    };

    Object.entries(this.references).forEach(([key, reference]) => {
      const subscription = reference.onSnapshot(doc => {
        const data = doc.data();
        if (
          data &&
          (!this.state[key] ||
            (this.state[key] && data.time > this.state[key].time))
        ) {
          this.updateStateFromEvent(key, data);
        }
      });

      this.subscriptions.push(subscription);
    });
  }

  componentWillUnmount() {
    this.subscriptions.forEach(unsubscribe => unsubscribe());
  }

  updateStateFromEvent = (key, data) => {
    const state = { ...this.state, [key]: data };
    const keys = Object.keys(this.references);
    const lines = keys
      .map(key => state[key] && state[key].value)
      .filter(value => value || value === "");
    this.setState({ ...state, value: lines.join("\n") });
  };

  commitUpdateStorage = value => {
    const keys = Object.keys(this.references);
    const lines = value.split(/\r?\n/g);
    keys.forEach(key => {
      const matchingLines = lines.filter(line => categorizeLine(line) === key);
      const value = matchingLines.join("\n");
      if (!value && this.state[key]) {
        this.references[key].set({
          value: null,
          time: Date.now(),
        });
      } else if (value && this.state[key] !== value) {
        this.references[key].set({
          value: value,
          time: Date.now(),
        });
      }
    });
  };
  updateStorage = debounce(this.commitUpdateStorage, 1000);

  update = event => {
    const value = event.nativeEvent.target.value;
    this.setState({ value: value, time: Date.now() });
    this.updateStorage(value);
  };

  render() {
    return this.props.children(this.state.value, this.update);
  }
}

export default DayData;
