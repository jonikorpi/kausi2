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
    const { remoteStorage, children } = this.props;
    const { open } = this.state;
    const Menu = this.state.Menu;

    return (
      <div className="navigation">
        <div>
          <Toggle open={open} toggleNavigation={this.toggleNavigation} />
          {open && Menu ? <Menu remoteStorage={remoteStorage} /> : null}
        </div>
        {children}
      </div>
    );
  }
}
