import React from "react";
import { format } from "date-fns/esm";
// import RemoteStorage from "remotestoragejs";

import Editor from "./Editor";

export default class Entry extends React.Component {
  static defaultProps = {
    path: "/",
    fillHeight: false,
  };

  updateEntry = event => {
    console.log("Updating entry", event.nativeEvent.target.value);
  };

  render() {
    const { path, fillHeight } = this.props;

    return (
      <Editor
        fillHeight={fillHeight}
        id={path}
        value={""}
        updateEntry={this.updateEntry}
      />
    );
  }
}
