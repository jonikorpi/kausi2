import React, { Component, PureComponent, Fragment } from "react";
import Textarea from "react-textarea-autosize";
import {
  startOfDay,
  startOfMonth,
  endOfDay,
  addDays,
  subDays,
  format,
  getDaysInMonth,
  getISOWeek,
  differenceInMilliseconds,
  differenceInMonths,
  subMonths,
  addMonths,
  isSameDay,
  isSameMonth,
  isWeekend,
} from "date-fns/esm";

import Data from "../components/Data";
import DayData from "../components/DayData";

import { database } from "../utilities/remotestorage.js";

const startOfToday = () => startOfDay(Date.now());
const endOfToday = () => endOfDay(Date.now());

const pathsFromDay = day => ({
  yearly: `repeating/yearlies/${format(day, "MM")}/${format(day, "dd")}.txt`,
  monthly: "repeating/monthlies/" + format(day, "dd") + ".txt",
  weekly: "repeating/weeklies/" + format(day, "EEEE") + ".txt",
  daily: "repeating/dailies.txt",
  calendar: `calendar/${format(day, "YYYY")}/${format(day, "MM")}/${format(
    day,
    "dd"
  )}.txt`,
});

class App extends Component {
  state = { databaseReady: false };

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);

    database.on("ready", () => this.setState({ databaseReady: true }));
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown = event => {
    if (event.keyCode === 27 && document.activeElement) {
      /*esc*/ document.activeElement.blur();
    }
  };

  render() {
    return this.state.databaseReady ? (
      <Fragment>
        <article className="panel calendar">
          <Calendar />
        </article>

        <article className="panel lists">
          <Lists />
        </article>
      </Fragment>
    ) : null;
  }
}

class Calendar extends Component {
  state = {
    today: startOfToday(),
    startAtMonth: startOfMonth(subMonths(Date.now(), 0)),
    endAtMonth: startOfMonth(addMonths(Date.now(), 0)),
  };

  componentDidMount() {
    this.setTodayTimer();
  }
  componentWillUnmount() {
    if (this.timer) {
      window.clearTimeout(this.timer);
    }
  }

  setTodayTimer = () => {
    this.timer = window.setTimeout(
      this.setToday,
      differenceInMilliseconds(endOfToday(), Date.now())
    );
  };
  setToday = () => {
    this.setState({ today: startOfToday() });
    this.setTodayTimer();
  };

  render() {
    const { today, startAtMonth, endAtMonth } = this.state;

    const months = [
      ...Array(differenceInMonths(endAtMonth, startAtMonth) + 1),
    ].map((value, index) => addMonths(startAtMonth, index));

    return (
      <Fragment>
        {months.map(month => {
          const days = [...Array(getDaysInMonth(month))].map((value, index) =>
            addDays(month, index)
          );

          const weeks = Object.values(
            days.reduce((weeks, day) => {
              const week = getISOWeek(day);
              weeks[week] = weeks[week] || [];
              weeks[week].push(day);
              return weeks;
            }, {})
          );

          const firstWeek = weeks[0];
          const lastWeek = weeks[weeks.length - 1];

          if (firstWeek.length < 7) {
            const daysToAdd = firstWeek.length;
            for (let index = 0; index < 7 - daysToAdd; index++) {
              firstWeek.unshift(subDays(firstWeek[0], 1));
            }
          }

          if (lastWeek.length < 7) {
            const daysToAdd = lastWeek.length;
            for (let index = 0; index < 7 - daysToAdd; index++) {
              lastWeek.push(addDays(lastWeek[lastWeek.length - 1], 1));
            }
          }

          return (
            <section className="section month" key={format(month, "MM-YYYY")}>
              <h1 className="section-title">{format(month, "MMMM MM/YYYY")}</h1>
              {Object.values(weeks).map((week, index) => (
                <div key={index} className="grid">
                  {week.map(day => {
                    const key = format(day, "dd-MM-YYYY");
                    return (
                      <Entry
                        key={key}
                        classNames={{
                          weekend: isWeekend(day),
                          ethereal: !isSameMonth(month, day),
                          isToday: isSameDay(day, today),
                          hasTitle: !!day,
                        }}
                      >
                        <DayData paths={pathsFromDay(day)}>
                          {(value, update) => {
                            return (
                              <div className="editor">
                                <label htmlFor={key} className="editor-title">
                                  {format(day, "dd EEE")}
                                </label>
                                <Textarea
                                  className="textarea"
                                  id={key}
                                  value={value}
                                  onChange={update}
                                  minRows={3}
                                />
                              </div>
                            );
                          }}
                        </DayData>
                      </Entry>
                    );
                  })}
                </div>
              ))}
            </section>
          );
        })}
      </Fragment>
    );
  }
}

const Lists = () => {
  const entries = [...Array(20)].map((value, index) => index);
  const groups = entries.reduce((groups, entry) => {
    const group = Math.floor(entry / 5);
    groups[group] = groups[group] || [];
    groups[group].push(entry);
    return groups;
  }, {});

  return (
    <section className="section">
      <h1 className="section-title">Lists or whatever</h1>

      {Object.values(groups).map((entries, index) => (
        <div key={index} className="grid" style={{ "--gridWidth": 5 }}>
          {entries.map(entry => (
            <Entry key={entry} classNames={{ "no-title": true }}>
              {["lists/" + (entry + 1) + ".txt"].map(key => (
                <Data path={key} key={key}>
                  {(value, update) => {
                    return (
                      <div className="editor">
                        <Textarea
                          className="textarea"
                          id={key}
                          value={value}
                          onChange={update}
                          minRows={3}
                        />
                      </div>
                    );
                  }}
                </Data>
              ))}
            </Entry>
          ))}
        </div>
      ))}
    </section>
  );
};

const Entry = ({ children, classNames = {} }) => {
  const classes = [
    "entry",
    ...Object.entries(classNames)
      .filter(className => className[1])
      .map(className => className[0]),
  ];

  return (
    <section className={classes.join(" ")}>
      <div className="entry-body">{children}</div>
    </section>
  );
};

export default App;
