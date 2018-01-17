import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Connection from "./Connection";
import Timeline from "./Timeline";

const App = props => (
  <Connection>
    {remoteStorage => <Timeline {...props} database={remoteStorage} />}
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
