import React from "react";
import { format } from "date-fns/esm";
// import RemoteStorage from "remotestoragejs";

// import Editor from "./Editor";

export default class Month extends React.Component {
  render() {
    const { date } = this.props;

    return format(date, "MMMM");
  }
}
