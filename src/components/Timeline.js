import React from "react";
import {
  startOfDay,
  isSameDay,
  parse,
  getDaysInMonth,
  setDate,
  startOfMonth,
} from "date-fns/esm";

import Year from "./Year";
import Month from "./Month";
import Day from "./Day";
import Links from "./Links";
import Panel from "./Panel";
import Navigation from "./Navigation";

export default class Timeline extends React.Component {
  state = {
    today: startOfDay(new Date()),
    activePanel: "days",
  };

  componentDidMount() {
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

  activatePanel = name => this.setState({ activePanel: name });

  render() {
    const { today, activePanel } = this.state;
    const { year, month, day } = this.props.match.params;

    const activeDate = year
      ? parse(`${year}/${month || "01"}/${day || "01"}`, "YYYY/MM/DD", today)
      : today;

    const daysInMonth = [...Array(getDaysInMonth(activeDate))];
    const firstOfMonth = startOfMonth(activeDate);

    return (
      <React.Fragment>
        <div className="panels">
          <Panel
            name="year"
            active={activePanel === "year"}
            activatePanel={() => this.activatePanel("year")}
          >
            <Year date={activeDate} />
          </Panel>

          <Panel
            name="month"
            active={activePanel === "month"}
            activatePanel={() => this.activatePanel("month")}
          >
            <Month date={activeDate} />
          </Panel>

          <Panel
            name="days"
            active={activePanel === "days"}
            activatePanel={() => this.activatePanel("days")}
          >
            {daysInMonth.map((nada, dayNumber) => (
              <Day
                key={dayNumber}
                date={setDate(firstOfMonth, dayNumber + 1)}
              />
            ))}
          </Panel>
        </div>

        <Navigation {...this.props}>
          <Links activeDate={activeDate} today={today} />
        </Navigation>
      </React.Fragment>
    );
  }
}
