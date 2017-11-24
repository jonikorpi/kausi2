import React from "react";
import Widget from "remotestorage-widget";

export default class Menu extends React.Component {
  componentDidMount() {
    const widget = new Widget(this.props.remoteStorage);
    widget.attach("widget");
  }

  render() {
    return (
      <div className="menu">
        Menu <div id="widget" />
      </div>
    );
  }
}
