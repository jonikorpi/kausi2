import React from "react";
import {
  startOfDay,
  isSameDay,
  parse,
  getDaysInMonth,
  setDate,
  startOfMonth,
  format,
} from "date-fns/esm";

import Entry from "./Entry";
import Links from "./Links";
import Panel from "./Panel";
import Navigation from "./Navigation";

const today = startOfDay(new Date());

export default class Timeline extends React.Component {
  state = {
    today: today,
    activePanel: "days",
    activeDay: today,
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
    const { today, activePanel, activeDay } = this.state;
    const { database } = this.props;
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
            <h1>{format(activeDate, "YYYY")}</h1>
            <Entry
              fillHeight={true}
              path={`/entries/${format(activeDate, "YYYY")}/year`}
            />
          </Panel>

          <Panel
            name="month"
            active={activePanel === "month"}
            activatePanel={() => this.activatePanel("month")}
          >
            <h2>{format(activeDate, "MMMM")}</h2>
            <Entry
              fillHeight={true}
              path={`/entries/${format(activeDate, "YYYY/MM")}/month`}
            />
          </Panel>

          <Panel
            name="navigation"
            active={activePanel === "navigation"}
            activatePanel={() => this.activatePanel("navigation")}
          >
            <Navigation {...this.props}>
              <Links activeDate={activeDate} today={today} />
            </Navigation>
          </Panel>
        </div>

        <div className="days">
          {daysInMonth.map((nada, dayNumber) => {
            const date = setDate(firstOfMonth, dayNumber + 1);

            return (
              <div className="day" key={dayNumber}>
                <h3 className="dayTitle">{format(date, "DD ddd")}</h3>
                <div className="dayCropper">
                  <Entry
                    database={database}
                    path={`/entries/${format(date, "YYYY/MM/DD")}`}
                  />
                  <Entry
                    database={database}
                    hideWithoutFocus={true}
                    path={`/reminders/${format(date, "MM/DD")}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </React.Fragment>
    );
  }
}
