import React from "react";
import Textarea from "react-textarea-autosize";
import debounce from "lodash.debounce";

export default class Entry extends React.Component {
  static defaultProps = {
    isActive: true,
    label: "Entry label",
    hideUnlessActive: false,
    hideLabel: false,
    onFocus: () => {},
    onFocusData: null,
    tabIndex: undefined,
    loading: false,
    data: null,
    reference: null,
  };

  state = { value: "" };

  componentWillReceiveProps(nextProps) {
    const { data } = this.props;

    if (nextProps.data && nextProps.data.time > (data ? data.time : 0)) {
      this.setState({ value: nextProps.data.value });
    }
  }

  componentWillUnmount() {
    this.debouncedUpdateEntry.cancel();
  }

  onFocus = () => {
    this.props.onFocus(this.props.onFocusData);
  };

  onChange = event => {
    this.setState({ value: event.target.value });
    this.debouncedUpdateEntry();
  };

  updateEntry = () => {
    const { reference } = this.props;
    const { value } = this.state;

    value
      ? reference.set({
          value: value,
          time: Date.now(),
        })
      : reference.delete();
  };

  debouncedUpdateEntry = debounce(this.updateEntry, 2000, { maxWait: 10000 });

  render() {
    const {
      label,
      hideUnlessActive,
      isActive,
      tabIndex,
      hideLabel,
      loading,
    } = this.props;
    const { value } = this.state;

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
            readOnly={loading}
          />
        </label>
      </div>
    );
  }
}
