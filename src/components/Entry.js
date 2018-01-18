import React from "react";
import { format } from "date-fns/esm";
// import RemoteStorage from "remotestoragejs";

import Editor from "./Editor";

export default class Entry extends React.Component {
  static defaultProps = {
    path: "",
    fillHeight: false,
    hideWithoutFocus: false,
  };

  state = { value: null };

  updateEntry = value => console.log(value);

  render() {
    const { path, fillHeight, hideWithoutFocus } = this.props;

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
