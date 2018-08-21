import React, { Component, Fragment } from "react";
import Textarea from "react-textarea-autosize";
import {
  startOfDay,
  startOfMonth,
  endOfMonth,
  endOfDay,
  addDays,
  format,
  getDaysInMonth,
  getTime,
  getISODay,
  differenceInMilliseconds,
  differenceInMonths,
  subMonths,
  addMonths,
  getMonth,
} from "date-fns/esm";
const startOfToday = () => startOfDay(Date.now());
const endOfToday = () => endOfDay(Date.now());

// const scrollIntoView = (element, offset) => {
//   const { top, height } = element.getBoundingClientRect();
//   const { clientHeight } = document.documentElement;
//   const isAbove = top < 0;
//   const isBelow = top + height > clientHeight;

//   if (isAbove || isBelow) {
//     window.scrollTo(0, window.scrollY + top - offset);
//   }
// };

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
          <h1>Lists</h1>
          <div className="grid">
            {[...Array(50)].map((value, index) => (
              <section className="entry list" key={index}>
                <div className="entry-body">
                  <h2>List {index}</h2>
                  <Textarea
                    onFocus={this.activateLists}
                    defaultValue={[...Array(Math.pow(55, index + 2) % 24 + 1)]
                      .map(() => `List entry ${index + 1}`)
                      .join("\n")}
                  />
                </div>
              </section>
            ))}
          </div>
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
  state = {
    today: startOfToday(),
    startAtMonth: startOfMonth(subMonths(Date.now(), 1)),
    endAtMonth: startOfMonth(addMonths(Date.now(), 1)),
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

          return (
            <section className="month" key={format(month, "MM-YYYY")}>
              <h1>{format(month, "MMMM YYYY")}</h1>
              <div className="grid">
                <section className="entry monthly">
                  <div className="entry-body">
                    <Textarea />
                  </div>
                </section>
              </div>

              <div
                className="grid"
                style={{
                  "--gridStartsFrom": getISODay(days[0]),
                }}
              >
                {days.map(day => (
                  <section className="entry daily" key={format(day, "DD")}>
                    <div className="entry-body">
                      <h2>{format(day, "dd E")}</h2>
                      <Textarea />
                    </div>
                  </section>
                ))}
              </div>
            </section>
          );
        })}
      </Fragment>
    );
  }
}

export default App;
