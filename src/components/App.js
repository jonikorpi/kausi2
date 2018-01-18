import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import FirebaseUser from "./FirebaseUser";
import Timeline from "./Timeline";

const App = props => (
  <FirebaseUser>{user => <Timeline {...props} {...user} />}</FirebaseUser>
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
