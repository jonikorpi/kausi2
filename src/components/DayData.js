import React, { Component } from "react";
import debounce from "lodash.debounce";

import { database, storage } from "../utilities/remotestorage.js";

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

class DayData extends Component {
  state = { value: "" };

  componentDidMount() {
    const paths = Object.values(this.props.paths);

    storage.client.on("change", this.handleEvent);
    paths.forEach(path =>
      storage.client
        .getFile(path)
        .then(({ data }) => this.updateStateFromEvent(path, data))
    );
  }

  componentWillUnmount() {
    storage.client.off("change", this.handleEvent);
  }

  handleEvent = event => {
    const paths = Object.values(this.props.paths);

    if (paths.includes(event.relativePath)) {
      const { newValue } = event;
      this.updateStateFromEvent(event.relativePath, newValue);
    }
  };

  updateStateFromEvent = (path, value) => {
    const state = { ...this.state, [path]: value };
    const paths = Object.values(this.props.paths);
    const lines = paths
      .map(path => state[path])
      .filter(value => value || value === "");
    this.setState({ ...state, value: lines.join("\n") });
  };

  commitUpdateStorage = value => {
    const { paths } = this.props;
    const lines = value.split(/\r?\n/g);

    Object.entries(paths).forEach(([type, path]) => {
      const matchingLines = lines.filter(line => categorizeLine(line) === type);
      const value = matchingLines.join("\n");

      if (!value && this.state[path]) {
        storage.remove({ path: path });
      } else if (value && this.state[path] !== value) {
        storage.update({
          path: path,
          value: value,
        });
      }
    });
  };
  updateStorage = debounce(this.commitUpdateStorage, 1000);

  update = event => {
    const value = event.nativeEvent.target.value;
    this.setState({ value: value });
    this.updateStorage(value);
  };

  render() {
    return this.props.children(this.state.value, this.update);
  }
}

export default DayData;
