import React from "react";
import { format } from "date-fns/esm";

import Editor from "./Editor";
import Firestore from "./Firestore";

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
      <Firestore query={database => ({ [path]: database.collection(path) })}>
        {firestore => {
          console.log(firestore);
          return (
            <Editor
              fillHeight={fillHeight}
              id={path}
              value={""}
              updateEntry={this.updateEntry}
            />
          );
        }}
      </Firestore>
    );
  }
}
