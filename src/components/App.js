import React from "react";
import Loadable from "react-loadable";
import { Router, Link } from "@reach/router";

import Account from "../components/Account";
import Home from "../components/Home";

const Loading = ({ error, pastDelay }) =>
  pastDelay || error ? (
    <div className="section">
      {error ? (
        <pre>
          <code>{error.message}</code>
        </pre>
      ) : (
        "Loading…"
      )}
    </div>
  ) : null;

const Authentication = Loadable({
  loader: () => import("../components/Authentication"),
  loading: Loading,
  timeout: 30000,
});

const Import = Loadable({
  loader: () => import("./Import"),
  loading: Loading,
  timeout: 30000,
});

class App extends React.Component {
  render() {
    return (
      <Account>
        {account => (
          <Router>
            <Home path="/" {...account} />
            <Authentication path="authenticate/*" {...account} />
            <Import path="import/*" {...account} />
          </Router>
        )}
      </Account>
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
