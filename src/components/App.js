import React, { Component } from "react";
import Textarea from "react-textarea-autosize";

const scrollIntoView = element => {
  const { top, height } = element.getBoundingClientRect();
  const { clientHeight } = document.documentElement;
  const isAbove = top < 0;
  const isBelow = top + height > clientHeight;

  if (isAbove || isBelow) {
    const scrollToTop = isAbove;
    element.scrollIntoView(scrollToTop);
  }
};

class App extends Component {
  state = {
    activeEntries: "daily",
    listOffset: 0,
    monthlyOffset: 0,
    dailyOffset: 0,
  };

  activateLists = event => {
    event.persist();
    this.setState({ activeEntries: "list" }, () =>
      scrollIntoView(event.nativeEvent.target.parentNode)
    );
  };
  activateMonthlies = event => {
    event.persist();
    this.setState({ activeEntries: "monthly" }, () =>
      scrollIntoView(event.nativeEvent.target.parentNode)
    );
  };
  activateDailies = event => {
    event.persist();
    this.setState({ activeEntries: "daily" }, () =>
      scrollIntoView(event.nativeEvent.target.parentNode)
    );
  };

  render() {
    const {
      activeEntries,
      listOffset,
      monthlyOffset,
      dailyOffset,
    } = this.state;

    return (
      <div className={`browser active-${activeEntries}`}>
        <article className="timeline">
          {[...Array(3)].map(() => (
            <section className="month">
              <div className="lists-track">
                <div className="entry list placeholder" />
              </div>
              <div className="month-track">
                <section className="entry monthly">
                  <h1>Monthly</h1>
                  <Textarea
                    onFocus={this.activateMonthlies}
                    defaultValue="Monthly entry"
                  />
                </section>
              </div>

              <section className="dailies-track">
                {[...Array(30)].map(() => (
                  <section className="entry daily">
                    <h1>Daily</h1>
                    <Textarea
                      onFocus={this.activateDailies}
                      defaultValue="Daily entry"
                    />
                  </section>
                ))}
              </section>
            </section>
          ))}
        </article>

        <article className="lists">
          {[...Array(50)].map(() => (
            <section className="entry list">
              <h1>List</h1>
              <Textarea
                onFocus={this.activateLists}
                defaultValue="List entry"
              />
            </section>
          ))}
        </article>
      </div>
    );
  }
}

export default App;
