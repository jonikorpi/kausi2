import React from "react";
import Loadable from "react-loadable";
import { Router, Link } from "@reach/router";

import Home from "../components/Home";

const Loading = ({ error, pastDelay }) =>
  pastDelay || error ? (
    <React.Fragment>
      {error ? (
        <pre>
          <code>{error.message}</code>
        </pre>
      ) : (
        "Loading authentication…"
      )}
    </React.Fragment>
  ) : null;

const Authentication = Loadable({
  loader: () => import("../components/Authentication"),
  loading: Loading,
  timeout: 30000,
});

class App extends React.Component {
  render() {
    return (
      <Router>
        <Home path="/" />
        <Authentication path="authenticate/*" />
      </Router>
    );
  }
}

const Header = ({ children }) => (
  <header className="section header">
    <Link to="/">
      <h1 className="logo">
        {Array.from("Kausi").map((letter, index) => (
          <span key={index}>{letter}</span>
        ))}
      </h1>
    </Link>

    {children}
  </header>
);

const Footer = ({ children }) => (
  <footer className="section footer">
    Privacy policy | Terms of service | Developed by Vuoro Design
    {children}
  </footer>
);

export { Header, Footer };
export default App;
