import React from "react";
import { startOfToday, isSameDay } from "date-fns";
// import { Link } from "react-router-dom";
//
// import Year from "./Year";
// import Month from "./Month";
// import Day from "./Day";

const getToday = () => startOfToday();

export default class Timeline extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      today: getToday(),
    };

    this.todayRefresher = setInterval(() => {
      const today = getToday();

      if (!isSameDay(today, this.state.today)) {
        this.setState({ today: today });
      }
    }, 10000);
  }

  componentWillUnmount() {
    clearInterval(this.todayRefresher);
  }

  render() {
    return "Timeline";
  }
}
