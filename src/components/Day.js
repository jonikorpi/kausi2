import React from "react";
import { format } from "date-fns/esm";

import Entry from "./Entry";

export default class Day extends React.Component {
  render() {
    const { date } = this.props;

    return (
      <div className="day">
        <h3 className="dayTitle">{format(date, "DD ddd")}</h3>
        <div className="dayCropper">
          <Entry path={`/entries/${format(date, "YYYY/MM/DD")}`} />
          <Entry
            hideWithoutFocus={true}
            path={`/reminders/${format(date, "MM/DD")}`}
          />
        </div>
      </div>
    );
  }
}
