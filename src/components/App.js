import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Connection from "./Connection";

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Connection} />
          <Route exact path="/:year" component={Connection} />
          <Route exact path="/:year/:month" component={Connection} />
          <Route exact path="/:year/:month/:day" component={Connection} />
        </Switch>
      </Router>
    );
  }
}

export default App;
