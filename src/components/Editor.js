import React from "react";
import Textarea from "react-textarea-autosize";

export default class Editor extends React.Component {
  static defaultProps = {
    id: "/",
    value: "",
    updateEntry: value => console.log(value),
    fillHeight: false,
  };

  state = { value: "" };

  onChange = event => {
    this.setState({ value: event.target.value });
    this.props.updateEntry(event.target.value);
  };

  render() {
    const { id, updateEntry, fillHeight } = this.props;
    const { value } = this.state;

    return (
      <div className={`editor ${fillHeight ? "fillHeight" : "noFillHeight"}`}>
        <label className="label" htmlFor={id}>
          <div className={`labelText ${value ? "notVisible" : "visible"}`}>
            {id}
          </div>
          <Textarea
            id={id}
            className="textArea"
            defaultValue={value}
            minRows={1}
            onChange={this.onChange}
          />
        </label>
      </div>
    );
  }
}
