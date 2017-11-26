import React from "react";

const Panel = ({ children, active, name, activatePanel }) => (
  <div
    className={`panel ${name}Panel ${active ? "active" : ""}`}
    onClick={activatePanel}
  >
    <div className="panelContent">{children}</div>
  </div>
);

export default Panel;
