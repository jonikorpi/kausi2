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
  isSameDay,
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

          return (
            <section className="section month" key={format(month, "MM-YYYY")}>
              <h1 className="section-title">{format(month, "MMMM YYYY")}</h1>
              <div className="grid" style={{ "--gridWidth": 2 }}>
                {[...Array(2)].map((value, index) => (
                  <Entry
                    key={index + 1}
                    data={[
                      "calendar/" +
                        format(month, "YYYY/MM") +
                        "/month/" +
                        index +
                        1,
                    ]}
                  />
                ))}
              </div>

              <div
                className="grid"
                style={{
                  "--gridStartsFrom": getISODay(days[0]),
                }}
              >
                {days.map(day => (
                  <Entry
                    autoFocus={this.shouldAutoFocus && isSameDay(today, day)}
                    data={[
                      "calendar/" + format(day, "YYYY/MM/dd"),
                      "reminders/" + format(day, "MM/dd"),
                    ]}
                    key={format(day, "dd-MM-YYYY")}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </Fragment>
    );
  }
}

const Lists = () => {
  return (
    <section className="section">
      <h1 className="section-title">Lists</h1>
      <div className="grid">
        {[...Array(50)].map((value, index) => (
          <Entry data={["lists/" + (index + 1)]} key={index + 1} />
        ))}
      </div>
    </section>
  );
};

class Entry extends Component {
  render() {
    const { data, autoFocus } = this.props;

    return (
      <section className="entry">
        <div className="entry-body">
          {data.map(key => (
            <Data key={key}>
              {(value, update) => {
                const isReminder = key.split("/")[0] === "reminders";
                const shouldAutoHide = !value && isReminder;
                return (
                  <div
                    className={`editor ${
                      shouldAutoHide ? "auto-hide" : "always-visible"
                    }`}
                  >
                    <label htmlFor={key} className="editor-title">
                      {key}
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

class Data extends Component {
  state = { value: "" };
  update = event => this.setState({ value: event.nativeEvent.target.value });

  render() {
    return this.props.children(this.state.value, this.update);
  }
}

export default App;
