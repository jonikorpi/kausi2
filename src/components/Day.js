import React from "react";
import { format } from "date-fns/esm";

import Entry from "./Entry";

export default class Day extends React.Component {
  render() {
    const { date } = this.props;

    return (
      <div className="day">
        <h3>{format(date, "DD dddd")}</h3>
        <Entry path={`/entries/${format(date, "YYYY/MM/DD")}`} />
        <Entry path={`/reminders/${format(date, "MM/DD")}`} />
      </div>
    );
  }
}
