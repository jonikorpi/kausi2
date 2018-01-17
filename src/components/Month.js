import React from "react";
import { format } from "date-fns/esm";

import Entry from "./Entry";

export default class Month extends React.Component {
  render() {
    const { date } = this.props;

    return (
      <React.Fragment>
        <h2>{format(date, "MMMM")}</h2>
        <Entry
          fillHeight={true}
          path={`/entries/${format(date, "YYYY/MM")}/month`}
        />
      </React.Fragment>
    );
  }
}
