import React from "react";
import { format } from "date-fns/esm";

import Entry from "./Entry";

export default class Year extends React.Component {
  render() {
    const { date } = this.props;

    return (
      <div className="year">
        <h1>{format(date, "YYYY")}</h1>
        <Entry path={`/entries/${format(date, "YYYY")}/year`} />
      </div>
    );
  }
}
