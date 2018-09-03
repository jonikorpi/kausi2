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

const startOfToday = () => startOfDay(Date.now());
const endOfToday = () => endOfDay(Date.now());

class App extends Component {
  state = {
    activePanel: "calendar",
    calendarScrolledTo: 0,
    listsScrolledTo: 0,
  };

  activateCalendar = () => {
    const scrollTo = this.state.calendarScrolledTo;
    this.setState(
      {
        activePanel: "calendar",
        calendarScrolledTo: 0,
        listsScrolledTo: window.scrollY,
      },
      () => {
        window.scrollTo(0, scrollTo);
        this.lists.scrollTop = this.state.listsScrolledTo;
      }
    );
  };
  activateLists = () => {
    const scrollTo = this.state.listsScrolledTo;
    this.setState(
      {
        activePanel: "lists",
        listsScrolledTo: 0,
        calendarScrolledTo: window.scrollY,
      },
      () => {
        window.scrollTo(0, scrollTo);
        this.calendar.scrollTop = this.state.calendarScrolledTo;
      }
    );
  };

  render() {
    const { activePanel, calendarScrolledTo, listsScrolledTo } = this.state;

    return (
      <Fragment>
        <article
          ref={element => (this.calendar = element)}
          className={`panel calendar ${
            activePanel === "calendar" ? "active" : "inactive"
          }`}
        >
          <Calendar />
        </article>

        <article
          ref={element => (this.lists = element)}
          className={`panel lists ${
            activePanel === "lists" ? "active" : "inactive"
          }`}
        >
          <Lists />
        </article>

        <button
          type="button"
          className={`clicker ${activePanel === "calendar" ? "top" : "bottom"}`}
          title={`Expand ${activePanel === "calendar" ? "lists" : "calendar"}`}
          onClick={
            activePanel === "calendar"
              ? this.activateLists
              : this.activateCalendar
          }
        />
      </Fragment>
    );
  }
}

class Calendar extends Component {
  shouldAutoFocus = true;
  state = {
    today: startOfToday(),
    startAtMonth: startOfMonth(subMonths(Date.now(), 1)),
    endAtMonth: startOfMonth(addMonths(Date.now(), 1)),
  };

  componentDidMount() {
    this.setTodayTimer();
    this.shouldAutoFocus = false;
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
              <h1 className="section-title">{format(month, "MMMM YYYY")}</h1>
              <div className="grid" style={{ "--gridWidth": 3 }}>
                {[...Array(3)].map((value, index) => (
                  <Entry
                    key={index + 1}
                    name={"Month" + index + 1}
                    data={[
                      "calendar/" +
                        format(month, "YYYY/MM") +
                        "/month/" +
                        (index + 1) +
                        ".txt",
                    ]}
                  />
                ))}
              </div>

              {Object.values(weeks).map((week, index) => (
                <div key={index} className="grid">
                  {week.map(day => (
                    <Entry
                      key={format(day, "dd-MM-YYYY")}
                      autoFocus={this.shouldAutoFocus && isSameDay(today, day)}
                      data={[
                        "calendar/" + format(day, "YYYY/MM/dd") + ".txt",
                        "reminders/" + format(day, "MM/dd") + ".txt",
                      ]}
                      weekend={isWeekend(day)}
                      ethereal={!isSameMonth(month, day)}
                      day={day}
                    />
                  ))}
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
  const entries = [...Array(50)].map((value, index) => index);
  const groups = entries.reduce((groups, entry) => {
    const group = Math.floor(entry / 5);
    groups[group] = groups[group] || [];
    groups[group].push(entry);
    return groups;
  }, {});

  return (
    <section className="section">
      <h1 className="section-title">Lists</h1>

      {Object.values(groups).map((entries, index) => (
        <div key={index} className="grid" style={{ "--gridWidth": 5 }}>
          {entries.map(entry => (
            <Entry
              key={entry + 1}
              name={"List" + entry + 1}
              data={["lists/" + (entry + 1) + ".txt"]}
            />
          ))}
        </div>
      ))}
    </section>
  );
};

class Entry extends Component {
  render() {
    const { data, autoFocus, weekend, day, name, ethereal } = this.props;

    return (
      <section
        className={`
        entry 
        ${weekend ? "weekend" : "not-weekend"}
        ${ethereal ? "ethereal" : "not-ethereal"}
      `}
      >
        <div className="entry-body">
          {data.map(key => (
            <Data path={key} key={key}>
              {(value, update) => {
                const isReminder = key.split("/")[0] === "reminders";
                const shouldAutoHide = !value && isReminder;
                return (
                  <div
                    className={`
                      editor 
                      ${shouldAutoHide ? "auto-hide" : "always-visible"}
                    `}
                  >
                    <label htmlFor={key} className="editor-title">
                      {key.split("/")[key.split("/").length - 1].split(".")[0]}
                    </label>
                    <Textarea
                      className="textarea"
                      id={key}
                      autoFocus={!isReminder && autoFocus}
                      value={value}
                      onChange={update}
                      onFocus={this.activate}
                      onBlur={this.deactivate}
                    />
                  </div>
                );
              }}
            </Data>
          ))}
        </div>
      </section>
    );
  }
}

export default App;
