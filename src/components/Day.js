import React from "react";
import { format } from "date-fns/esm";
// import RemoteStorage from "remotestoragejs";

// import Editor from "./Editor";

export default class Day extends React.Component {
  render() {
    const { date } = this.props;

    return <div>{format(date, "DD dddd")}</div>;
  }
}
