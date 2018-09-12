import React, { Component, Fragment } from "react";
import Widget from "remotestorage-widget";

import { database } from "../utilities/remotestorage.js";

class Menu extends Component {
  componentDidMount() {
    const widget = new Widget(database);
    widget.attach("widget");
  }
  render() {
    return <div id="widget" />;
  }
}

export default Menu;
