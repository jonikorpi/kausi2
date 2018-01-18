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

const today = startOfDay(new Date());

export default class Timeline extends React.Component {
  state = {
    today: today,
    activePanel: "days",
  };

  componentDidMount() {
    this.todayRefresher = setInterval(() => {
      const today = startOfDay(new Date());

      if (!isSameDay(today, this.state.today)) {
        this.setState({ today: today });
      }
    }, 10000);

    this.centerViewport();
  }

  componentWillUnmount() {
    clearInterval(this.todayRefresher);
  }

  activatePanel = name => this.setState({ activePanel: name });
  activateDay = day => {
    this.props.history.replace(`/${format(day, "YYYY/MM/DD")}`);
  };

  componentDidUpdate() {
    this.centerViewport();
  }

  centerViewport = () => {
    const { today } = this.state;
    const { year, month, day } = this.props.match.params;
    const activeDay = year
      ? parse(`${year}/${month || "01"}/${day || "01"}`, "YYYY/MM/DD", today)
      : today;

    const element = document.getElementById(format(activeDay, "YYYY-MM-DD"));
    const elementRect = element.getBoundingClientRect();
    const absoluteElementLeft =
      elementRect.left + window.pageXOffset + elementRect.width / 2;
    const middle = absoluteElementLeft - window.innerWidth / 2;
    window.scrollTo(middle, 0);
  };

  render() {
    const { today, activePanel } = this.state;
    const { userID, isAnonymous } = this.props;
    const { year, month, day } = this.props.match.params;

    const activeDay = year
      ? parse(`${year}/${month || "01"}/${day || "01"}`, "YYYY/MM/DD", today)
      : today;

    const daysInMonth = [...Array(getDaysInMonth(activeDay))];
    const firstOfMonth = startOfMonth(activeDay);

    return (
      <React.Fragment>
        <div className="panels">
          <div className="year">
            <h1>{format(activeDay, "YYYY")}</h1>
            <Entry
              fillHeight={true}
              label="Yearly"
              path={`${userID}/yearlyEntries/${format(activeDay, "YYYY")}`}
            />
          </div>

          <div className="month">
            <h2>{format(activeDay, "MMMM")}</h2>
            <Entry
              fillHeight={true}
              label="Monthly entry"
              path={`${userID}/monthlyEntries/${format(activeDay, "YYYY-MM")}`}
            />
          </div>

          <div className="navigation">
            <Links />
          </div>
        </div>

        <div className="days">
          {daysInMonth.map((nada, dayNumber) => {
            const day = setDate(firstOfMonth, dayNumber + 1);
            const isActive = isSameDay(activeDay, day);
            const isToday = isSameDay(today, day);

            return (
              <div
                className={`day ${isActive ? "active" : "notActive"}`}
                id={format(day, "YYYY-MM-DD")}
                key={dayNumber}
              >
                <h3 className="dayTitle">{format(day, "DD ddd")}</h3>
                <div className="dayCropper">
                  <div className="daySizer">
                    <Entry
                      isActive={isActive}
                      isToday={isToday}
                      label="This day"
                      hideLabel={true}
                      path={`${userID}/entries/${format(day, "YYYY-MM-DD")}`}
                      onFocus={this.activateDay}
                      onFocusData={day}
                    />
                    <Entry
                      isActive={isActive}
                      isToday={isToday}
                      label={`Every ${format(day, "dddd")}`}
                      hideUnlessActive={true}
                      path={`${userID}/weeklies/${format(day, "dddd")}`}
                      onFocus={this.activateDay}
                      onFocusData={day}
                      tabIndex={-1}
                    />
                    {format(day, "DD") < 29 && (
                      <Entry
                        isActive={isActive}
                        isToday={isToday}
                        label={`Every ${format(day, "DDDo")}`}
                        hideUnlessActive={true}
                        path={`${userID}/monthlies/${format(day, "DD")}`}
                        onFocus={this.activateDay}
                        onFocusData={day}
                        tabIndex={-1}
                      />
                    )}
                    <Entry
                      isActive={isActive}
                      isToday={isToday}
                      label={`Every year on ${format(day, "MMM DDDo")}`}
                      hideUnlessActive={true}
                      path={`${userID}/yearlies/${format(day, "MM-DD")}`}
                      onFocus={this.activateDay}
                      onFocusData={day}
                      tabIndex={-1}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </React.Fragment>
    );
  }
}
