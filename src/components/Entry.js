import React from "react";
import { format } from "date-fns/esm";
// import RemoteStorage from "remotestoragejs";

import Editor from "./Editor";

export default class Entry extends React.Component {
  updateEntry = event => {
    console.log("Updating entry", event.nativeEvent.target.value);
  };

  render() {
    const { path } = this.props;

    return <Editor id={path} value={""} updateEntry={this.updateEntry} />;
  }
}
