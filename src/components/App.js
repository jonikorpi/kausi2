import React, { Component } from "react";
import Textarea from "react-textarea-autosize";

class App extends Component {
  state = {
    activeEntries: "daily",
    listOffset: 0,
    monthlyOffset: 0,
    dailyOffset: 0,
  };

  activateLists = () => this.setState({ activeEntries: "list" });
  activateMonthlies = () => this.setState({ activeEntries: "monthly" });
  activateDailies = () => this.setState({ activeEntries: "daily" });

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
