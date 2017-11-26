import React from "react";

const Panel = ({ children, active }) => (
  <div className={`panel ${active ? "active" : ""}`}>{children}</div>
);

export default Panel;
