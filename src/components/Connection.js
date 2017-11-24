import React from "react";

import Timeline from "./Timeline";
import Navigation from "./Navigation";

export default class Connection extends React.Component {
  render() {
    return [
      <Timeline key="Timeline" {...this.props} />,
      <Navigation key="Navigation" {...this.props} />,
    ];
  }
}
