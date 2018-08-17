import React from "react";
import ReactDOM from "react-dom";

import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";

import "jonikorpi-base-files/reset.css";
import "./stylesheets/main.css";

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
