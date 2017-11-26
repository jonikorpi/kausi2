import React from "react";
import { startOfDay, isSameDay, parse } from "date-fns/esm";
//
// import Year from "./Year";
// import Month from "./Month";
// import Day from "./Day";
import Links from "./Links";

export default class Timeline extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      today: startOfDay(new Date()),
    };

    this.todayRefresher = setInterval(() => {
      const today = startOfDay(new Date());

      if (!isSameDay(today, this.state.today)) {
        this.setState({ today: today });
      }
    }, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.todayRefresher);
  }

  render() {
    const { today } = this.state;
    const { year, month, day } = this.props.match.params;

    const activeDate = year
      ? parse(`${year}/${month || "01"}/${day || "01"}`, "YYYY/MM/DD", today)
      : today;

    return (
      <div className="timeline">
        <Links activeDate={activeDate} today={today} />
        <Links activeDate={activeDate} today={today} />
      </div>
    );
  }
}
