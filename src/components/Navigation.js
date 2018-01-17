import React from "react";

import Toggle from "./Toggle";

export default class Navigation extends React.Component {
  constructor(props) {
    super(props);

    this.state = { open: false, Menu: null };
  }

  toggleNavigation = async () => {
    this.setState({ open: !this.state.open });
    const Menu = await import("./Menu");
    this.setState({ Menu: Menu.default });
  };

  render() {
    const { remoteStorage } = this.props;
    const { open } = this.state;
    const Menu = this.state.Menu;

    return (
      <React.Fragment>
        {open && Menu ? <Menu remoteStorage={remoteStorage} /> : null}
        <Toggle open={open} toggleNavigation={this.toggleNavigation} />,
      </React.Fragment>
    );
  }
}
