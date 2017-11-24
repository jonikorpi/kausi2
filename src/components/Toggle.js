import React from "react";

export default class Toggle extends React.Component {
  render() {
    const { open } = this.props;

    return (
      <div className="toggle">
        <button onClick={this.props.toggleNavigation} className="toggleButton">
          {open ? "Close" : "Saving in this browser"}
        </button>
      </div>
    );
  }
}
