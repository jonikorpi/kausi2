import React from "react";
import RemoteStorage from "remotestoragejs";

import Timeline from "./Timeline";
import Navigation from "./Navigation";

export default class Connection extends React.Component {
  componentWillMount() {
    this.remoteStorage = new RemoteStorage({
      logging: process.env.NODE_ENV === "development",
    });
    this.remoteStorage.access.claim("kausi", "rw");
  }

  render() {
    return [
      <Timeline
        key="Timeline"
        {...this.props}
        remoteStorage={this.remoteStorage}
      />,
      <Navigation
        key="Navigation"
        {...this.props}
        remoteStorage={this.remoteStorage}
      />,
    ];
  }
}
