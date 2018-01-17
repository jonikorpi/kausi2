import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Connection from "./Connection";

export default () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Connection} />
      <Route exact path="/:year" component={Connection} />
      <Route exact path="/:year/:month" component={Connection} />
      <Route exact path="/:year/:month/:day" component={Connection} />
    </Switch>
  </Router>
);
