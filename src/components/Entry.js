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

  componentWillMount() {
    const { path, database } = this.props;

    // database.getObject(path).then(entry => console.log(entry));
  }

  updateEntry = event => {
    // // List all items in the "foo/" category/folder
    // client.getListing('')
    //   .then(listing => console.log(listing));
    //
    // // Write some text to "foo/bar.txt"
    // const content = 'The most simple things can bring the most happiness.'
    // client.storeFile('text/plain', 'bar.txt', content)
    //   .then(() => console.log("data has been saved"));

    console.log("Updating entry", event.nativeEvent.target.value);
  };

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
