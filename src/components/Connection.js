import React from "react";
import RemoteStorage from "remotestoragejs";

export default class Connection extends React.Component {
  componentWillMount() {
    this.remoteStorage = new RemoteStorage({
      logging: process.env.NODE_ENV === "development",
    });
    // this.remoteStorage.caching.enable("/kausi/");
    this.remoteStorage.access.claim("kausi", "rw");
  }

  render() {
    return this.props.children(this.remoteStorage);
  }
}
