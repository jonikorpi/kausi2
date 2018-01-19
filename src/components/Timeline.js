import React from "react";
import {
  startOfDay,
  isSameDay,
  parse,
  getDaysInMonth,
  setDate,
  startOfMonth,
  format,
  isWeekend,
  isLeapYear,
} from "date-fns/esm";

import Entry from "./Entry";
import Firestore from "./Firestore";
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
            <Firestore
              query={database => ({
                entry: database
                  .collection(`users/${userID}/yearEntries`)
                  .doc(format(activeDay, "YYYY")),
              })}
            >
              {({ entry }) => (
                <Entry
                  label="Yearly entry"
                  loading={entry.loading}
                  data={
                    entry.snapshot && entry.snapshot.exists
                      ? entry.snapshot.data()
                      : null
                  }
                  reference={entry.reference}
                />
              )}
            </Firestore>
          </div>

          <div className="month">
            <Firestore
              query={database => ({
                entry: database
                  .collection(`users/${userID}/monthEntries`)
                  .doc(format(activeDay, "YYYY-MM")),
              })}
            >
              {({ entry }) => (
                <Entry
                  label="Monthly entry"
                  loading={entry.loading}
                  data={
                    entry.snapshot && entry.snapshot.exists
                      ? entry.snapshot.data()
                      : null
                  }
                  reference={entry.reference}
                />
              )}
            </Firestore>
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
            const isDuringWeekend = isWeekend(day);
            const isLeapDay = isLeapYear(day) && format(day, "D") === "29";

            return (
              <div
                className={`day ${isActive ? "active" : "notActive"} ${
                  isToday ? "today" : "notToday"
                } ${isDuringWeekend ? "weekend" : "weekday"} ${
                  isLeapDay ? "leapDay" : ""
                }`}
                id={format(day, "YYYY-MM-DD")}
                key={dayNumber}
              >
                <h3 className="dayTitle">{format(day, "DD ddd")}</h3>
                <div className="dayCropper">
                  <div className="daySizer">
                    <Firestore
                      query={database => ({
                        entry: database
                          .collection(`users/${userID}/dayEntries`)
                          .doc(format(day, "YYYY-MM-DD")),
                      })}
                    >
                      {({ entry }) => (
                        <Entry
                          isActive={isActive}
                          label="This day"
                          hideLabel={true}
                          onFocus={this.activateDay}
                          onFocusData={day}
                          loading={entry.loading}
                          data={
                            entry.snapshot && entry.snapshot.exists
                              ? entry.snapshot.data()
                              : null
                          }
                          reference={entry.reference}
                        />
                      )}
                    </Firestore>

                    <Firestore
                      query={database => ({
                        entry: database
                          .collection(`users/${userID}/weeklies`)
                          .doc(format(day, "dddd")),
                      })}
                    >
                      {({ entry }) => (
                        <Entry
                          isActive={isActive}
                          label={`Every ${format(day, "dddd")}`}
                          hideUnlessActive={true}
                          onFocus={this.activateDay}
                          onFocusData={day}
                          tabIndex={-1}
                          loading={entry.loading}
                          data={
                            entry.snapshot && entry.snapshot.exists
                              ? entry.snapshot.data()
                              : null
                          }
                          reference={entry.reference}
                        />
                      )}
                    </Firestore>

                    {format(day, "DD") < 29 && (
                      <Firestore
                        query={database => ({
                          entry: database
                            .collection(`users/${userID}/monthlies`)
                            .doc(format(day, "DD")),
                        })}
                      >
                        {({ entry }) => (
                          <Entry
                            isActive={isActive}
                            label={`Every ${format(day, "Do")}`}
                            hideUnlessActive={true}
                            onFocus={this.activateDay}
                            onFocusData={day}
                            tabIndex={-1}
                            loading={entry.loading}
                            data={
                              entry.snapshot && entry.snapshot.exists
                                ? entry.snapshot.data()
                                : null
                            }
                            reference={entry.reference}
                          />
                        )}
                      </Firestore>
                    )}

                    <Firestore
                      query={database => ({
                        entry: database
                          .collection(`users/${userID}/yearlies`)
                          .doc(format(day, "MM-DD")),
                      })}
                    >
                      {({ entry }) => (
                        <Entry
                          isActive={isActive}
                          isToday={isToday}
                          label={
                            isLeapDay
                              ? "Every leap year on leap day"
                              : `Every year on ${format(day, "MMM Do")}`
                          }
                          hideUnlessActive={true}
                          onFocus={this.activateDay}
                          onFocusData={day}
                          tabIndex={-1}
                          loading={entry.loading}
                          data={
                            entry.snapshot && entry.snapshot.exists
                              ? entry.snapshot.data()
                              : null
                          }
                          reference={entry.reference}
                        />
                      )}
                    </Firestore>
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
