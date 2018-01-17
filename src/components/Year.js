import React from "react";
import { format } from "date-fns/esm";

import Entry from "./Entry";

export default class Year extends React.Component {
  render() {
    const { date } = this.props;

    return (
      <React.Fragment>
        <h1>{format(date, "YYYY")}</h1>
        <Entry
          fillHeight={true}
          path={`/entries/${format(date, "YYYY")}/year`}
        />
      </React.Fragment>
    );
  }
}
