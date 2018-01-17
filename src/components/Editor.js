import React from "react";
import Textarea from "react-textarea-autosize";

export default class Editor extends React.Component {
  static defaultProps = {
    id: "/",
    value: "",
    updateEntry: value => console.log(value),
    fillHeight: false,
  };

  render() {
    const { id, value, updateEntry, fillHeight } = this.props;

    return (
      <div className={`editor ${fillHeight ? "fillHeight" : "noFillHeight"}`}>
        <label className="label" htmlFor={id}>
          <div className="labelText">{id}</div>
          <Textarea
            id={id}
            className="textArea"
            defaultValue={value}
            minRows={2}
            onChange={updateEntry}
          />
        </label>
      </div>
    );
  }
}
