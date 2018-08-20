import React, { Component } from "react";
import Textarea from "react-textarea-autosize";

const scrollIntoView = (element, offset) => {
  const { top, height } = element.getBoundingClientRect();
  const { clientHeight } = document.documentElement;
  const isAbove = top < 0;
  const isBelow = top + height > clientHeight;

  if (isAbove || isBelow) {
    window.scrollTo(0, window.scrollY + top - offset);
  }
};

class App extends Component {
  state = {
    activeEntries: "dailies",
    listsOffset: 0,
    monthliesOffset: 0,
    dailiesOffset: 0,
  };

  activateLists = event => {
    event.persist();
    const element = event.nativeEvent.target.parentNode;
    const offset = element.getBoundingClientRect().top;
    const activeOffset = `${this.state.activeEntries}Offset`;
    this.setState(
      {
        activeEntries: "lists",
        [activeOffset]: this.state[activeOffset] || -window.scrollY,
        listsOffset: 0,
      },
      () => scrollIntoView(element, offset)
    );
  };
  activateMonthlies = event => {
    event.persist();
    const element = event.nativeEvent.target.parentNode;
    const offset = element.getBoundingClientRect().top;
    const activeOffset = `${this.state.activeEntries}Offset`;
    this.setState(
      {
        activeEntries: "monthlies",
        [activeOffset]: this.state[activeOffset] || -window.scrollY,
        monthliesOffset: 0,
      },
      () => scrollIntoView(element, offset)
    );
  };
  activateDailies = event => {
    event.persist();
    const element = event.nativeEvent.target.parentNode;
    const offset = element.getBoundingClientRect().top;
    const activeOffset = `${this.state.activeEntries}Offset`;
    this.setState(
      {
        activeEntries: "dailies",
        [activeOffset]: this.state[activeOffset] || -window.scrollY,
        dailiesOffset: 0,
      },
      () => scrollIntoView(element, offset)
    );
  };

  render() {
    const {
      activeEntries,
      listsOffset,
      monthliesOffset,
      dailiesOffset,
    } = this.state;

    return (
      <div
        className={`browser active-${activeEntries}`}
        style={{
          "--listsOffset": listsOffset + "px",
          "--monthliesOffset": monthliesOffset + "px",
          "--dailiesOffset": dailiesOffset + "px",
        }}
      >
        <article className="timeline">
          {[...Array(3)].map((value, index) => (
            <section className="month" key={index}>
              <div className="lists-track track placeholder">
                <div className="entry list" />
              </div>
              <div className="monthlies-track track">
                <section className="entry monthly">
                  <h1>Month {index + 1}</h1>
                  <Textarea
                    onFocus={this.activateMonthlies}
                    defaultValue={[...Array(Math.pow(55, index + 2) % 24 + 1)]
                      .map(() => `Monthly entry ${index + 1}`)
                      .join("\n")}
                  />
                </section>
              </div>

              <section className="dailies-track track">
                {[...Array(30)].map((value, index) => (
                  <section className="entry daily" key={index}>
                    <h1>Daily {index + 1}</h1>
                    <Textarea
                      onFocus={this.activateDailies}
                      defaultValue={[...Array(Math.pow(55, index + 2) % 24 + 1)]
                        .map(() => `Daily entry ${index + 1}`)
                        .join("\n")}
                    />
                  </section>
                ))}
              </section>
            </section>
          ))}
        </article>

        <article className="lists">
          <div className="lists-track track">
            {[...Array(50)].map((value, index) => (
              <section className="entry list" key={index}>
                <h1>List {index}</h1>
                <Textarea
                  onFocus={this.activateLists}
                  defaultValue={[...Array(Math.pow(55, index + 2) % 24 + 1)]
                    .map(() => `List entry ${index + 1}`)
                    .join("\n")}
                />
              </section>
            ))}
          </div>
          <div className="monthlies-track track placeholder">
            <div className="entry monthly" />
          </div>
          <div className="dailies-track track placeholder">
            <div className="entry daily" />
          </div>
        </article>
      </div>
    );
  }
}

export default App;
