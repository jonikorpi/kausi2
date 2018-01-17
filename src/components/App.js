import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Connection from "./Connection";
import Timeline from "./Timeline";

const App = props => (
  <Connection>
    {(remoteStorage, database) => (
      <Timeline {...props} remoteStorage={remoteStorage} database={database} />
    )}
  </Connection>
);

export default () => (
  <Router>
    <Switch>
      <Route exact path="/" component={App} />
      <Route exact path="/:year" component={App} />
      <Route exact path="/:year/:month" component={App} />
      <Route exact path="/:year/:month/:day" component={App} />
    </Switch>
  </Router>
);
