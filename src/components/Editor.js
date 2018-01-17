import React from "react";
import Textarea from "react-textarea-autosize";

export default class Editor extends React.Component {
  render() {
    const { id, value, updateEntry } = this.props;

    return (
      <div className="editor">
        <label className="label" htmlFor={id}>
          {id}
        </label>
        <Textarea
          id={id}
          className="textArea"
          defaultValue={value}
          minRows={2}
          onChange={updateEntry}
        />
      </div>
    );
  }
}
