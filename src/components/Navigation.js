import React from "react";

import Toggle from "./Toggle";
import Menu from "./Menu";

export default class Navigation extends React.Component {
  constructor(props) {
    super(props);

    this.state = { open: false };
  }

  toggleNavigation = () => this.setState({ open: !this.state.open });

  render() {
    const { remoteStorage } = this.props;
    const { open } = this.state;

    return [
      open && <Menu key="Menu" remoteStorage={remoteStorage} />,
      <Toggle
        key="Toggle"
        open={open}
        toggleNavigation={this.toggleNavigation}
      />,
    ];
  }
}
