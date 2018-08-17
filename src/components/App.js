import React, { Component } from "react";
import Textarea from "react-textarea-autosize";

class App extends Component {
  render() {
    return (
      <div className="panels">
        <div className="panel inactive">
          {[...Array(6)].map(() => (
            <section className="section">
              <h1>List section</h1>
              <Textarea />
            </section>
          ))}
        </div>

        <div className="panel inactive">
          {[...Array(2)].map(() => (
            <section className="section">
              <h1>Month section</h1>
              <Textarea />
            </section>
          ))}
        </div>

        <div className="panel active">
          {[...Array(60)].map(() => (
            <section className="section">
              <h1>Day section</h1>
              <Textarea />
            </section>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
