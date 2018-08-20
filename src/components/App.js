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
    activeEntries: "daily",
    listOffset: 0,
  };

  activateLists = event => {
    event.persist();
    const element = event.nativeEvent.target.parentNode;
    const offset = element.getBoundingClientRect().top;
    this.setState(
      {
        activeEntries: "list",
        // [`${this.state.activeEntries}Offset`]: -window.scrollY,
        listOffset: 0,
      },
      () => scrollIntoView(element, offset)
    );
  };
  activateMonthlies = event => {
    event.persist();
    const element = event.nativeEvent.target.parentNode;
    const offset = element.getBoundingClientRect().top;
    this.setState(
      {
        activeEntries: "monthly",
        listOffset:
          this.state.activeEntries === "list"
            ? -window.scrollY
            : this.state.listOffset,
      },
      () => scrollIntoView(element, offset)
    );
  };
  activateDailies = event => {
    event.persist();
    const element = event.nativeEvent.target.parentNode;
    const offset = element.getBoundingClientRect().top;
    this.setState(
      {
        activeEntries: "daily",
        listOffset:
          this.state.activeEntries === "list"
            ? -window.scrollY
            : this.state.listOffset,
      },
      () => scrollIntoView(element, offset)
    );
  };

  render() {
    const { activeEntries, listOffset } = this.state;

    return (
      <div
        className={`browser active-${activeEntries}`}
        style={{
          "--listOffset": listOffset + "px",
        }}
      >
        <article className="timeline">
          {[...Array(3)].map((value, index) => (
            <section className="month" key={index}>
              <div className="lists-track">
                <div className="entry list placeholder" />
              </div>
              <div className="month-track">
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

              <section className="dailies-track">
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
        </article>
      </div>
    );
  }
}

export default App;
