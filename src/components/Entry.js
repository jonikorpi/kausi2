import React from "react";
import { format } from "date-fns/esm";
import Textarea from "react-textarea-autosize";

import Firestore from "./Firestore";

export default class Entry extends React.Component {
  static defaultProps = {
    path: "",
    isActive: true,
    label: "Entry label",
    hideUnlessActive: false,
    hideLabel: false,
    onFocus: () => {},
    onFocusData: null,
    tabIndex: undefined,
  };

  state = { value: "" };

  onChange = event => {
    this.setState({ value: event.target.value });
    this.updateEntry();
  };

  onFocus = () => {
    this.props.onFocus(this.props.onFocusData);
  };

  updateEntry = () => console.log(this.state.value);

  render() {
    const {
      query,
      label,
      hideUnlessActive,
      isActive,
      tabIndex,
      hideLabel,
    } = this.props;
    const { value } = this.state;

    return (
      <Firestore query={query}>
        {firestore => {
          return (
            <div
              className={`editor ${
                hideUnlessActive && !isActive ? "notVisible" : "visible"
              }`}
            >
              <label className="label">
                <div
                  className={`labelText ${
                    hideLabel || !isActive ? "notVisible" : "visible"
                  }`}
                >
                  {label}
                </div>
                <Textarea
                  className="textArea"
                  value={value}
                  minRows={1}
                  onChange={this.onChange}
                  onFocus={this.onFocus}
                  tabIndex={tabIndex}
                />
              </label>
            </div>
          );
        }}
      </Firestore>
    );
  }
}
