import React from "react";
import { startOfToday, isSameDay, getTime, parse } from "date-fns";
// import { Link } from "react-router-dom";
//
// import Year from "./Year";
// import Month from "./Month";
// import Day from "./Day";

export default class Timeline extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      today: startOfToday(),
    };

    this.todayRefresher = setInterval(() => {
      const today = startOfToday();

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
      ? parse(`${year}-${month || 1}-${day || 1}`)
      : today;

    return getTime(activeDate);
  }
}
