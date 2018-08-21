import React, { Component } from "react";
import Textarea from "react-textarea-autosize";
import { startOfToday, addDays, format } from "date-fns";

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
      <React.Fragment>
        <article
          ref={element => (this.calendar = element)}
          className={`panel calendar ${
            activePanel === "calendar" ? "active" : "inactive"
          }`}
        >
          {[...Array(3)].map((value, index) => (
            <section className="month" key={index}>
              <h1>Month {index + 1}</h1>
              <div className="grid">
                <section className="entry monthly">
                  <div className="entry-body">
                    <Textarea
                      onFocus={this.activateMonthlies}
                      defaultValue={[...Array(Math.pow(55, index + 2) % 24 + 1)]
                        .map(() => `Monthly entry ${index + 1}`)
                        .join("\n")}
                    />
                  </div>
                </section>
              </div>

              <div className="grid">
                {[...Array(30)].map((value, index) => (
                  <section className="entry daily" key={index}>
                    <div className="entry-body">
                      <h2>
                        {format(addDays(startOfToday(), index), "DD dddd")}
                      </h2>
                      <Textarea
                        onFocus={this.activateDailies}
                        defaultValue={[
                          ...Array(Math.pow(55, index + 2) % 24 + 1),
                        ]
                          .map(() => `Daily entry ${index + 1}`)
                          .join("\n")}
                      />
                    </div>
                  </section>
                ))}
              </div>
            </section>
          ))}
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
      </React.Fragment>
    );
  }
}

export default App;
