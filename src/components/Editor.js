import React from "react";
import Textarea from "react-textarea-autosize";

export default class Editor extends React.Component {
  render() {
    const { value, updateEntry } = this.props;

    return (
      <Textarea
        className="editor"
        defaultValue={value}
        minRows={3}
        onChange={updateEntry}
      />
    );
  }
}
