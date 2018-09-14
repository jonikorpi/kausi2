import React, { Fragment } from "react";
import { Link, navigate } from "@reach/router";
import { format } from "date-fns/esm";

import { Header, Footer } from "../components/App";

import firestore from "../utilities/firestore";
import { list } from "postcss";

class Authentication extends React.Component {
  state = { log: null };

  handleSubmit = async event => {
    event.preventDefault();
    const { userID } = this.props;

    this.setState({ log: "Starting import…" });

    try {
      const data = Object.values(
        JSON.parse(event.nativeEvent.target.elements["importData"].value)
      ).filter(entry => entry !== null && typeof entry === "object");

      if (!data || data.length === 0) {
        this.setState({ log: "Could not detect any data to import." });
        return;
      }

      // omg I hate my past self
      const calendar = data.filter(
        entry =>
          typeof entry.date === "number" && format(entry.date, "YYYY") > 1970
      );
      const monthly = data.filter(
        entry =>
          typeof entry.date === "string" && +entry.date <= 31 && +entry.date > 0
      );
      const weekly = data.filter(
        entry => typeof entry.date === "string" && entry.date.length > 2
      );
      const lists = data.filter(
        entry =>
          typeof entry.date === "number" &&
          format(entry.date, "YYYY") === "1970"
      );

      const user = firestore.collection("users").doc(userID);
      const now = Date.now();

      if (monthly.length + weekly.length + lists.length > 0) {
        const updates = firestore.batch();

        monthly.forEach(entry =>
          updates.set(
            user
              .collection("repeating")
              .doc(entry.date < 10 ? `0${entry.date}` : `${entry.date}`),
            {
              value: entry.text
                .split(/\r?\n/g)
                .map(line => "#monthly " + line)
                .join("\n"),
              time: now,
            }
          )
        );
        weekly.forEach(entry =>
          updates.set(user.collection("repeating").doc(entry.date), {
            value: entry.text
              .split(/\r?\n/g)
              .map(line => "#weekly " + line)
              .join("\n"),
            time: now,
          })
        );
        lists.forEach((entry, index) =>
          updates.set(user.collection("lists").doc(`${index}`), {
            value: entry.text.split(/\r?\n/g).join("\n"),
            time: now,
          })
        );

        await updates.commit();
        this.setState({
          log:
            this.state.log +
            `\nImported ${monthly.length} monthlies, ${
              weekly.length
            } weeklies, and  ${lists.length} lists…` +
            (calendar.length > 0 ? "" : "\nImport successful!"),
        });
      }

      if (calendar.length > 0) {
        const calendarChunks = calendar.reduce((all, one, i) => {
          const chunk = Math.floor(i / 100);
          all[chunk] = [].concat(all[chunk] || [], one);
          return all;
        }, []);

        calendarChunks.forEach(async (chunk, index) => {
          const updates = firestore.batch();
          chunk.forEach(entry =>
            updates.set(
              user
                .collection("calendar")
                .doc("" + format(entry.date, "YYYY-MM-dd")),
              { value: entry.text, time: now }
            )
          );
          await updates.commit();
          this.setState({
            log:
              this.state.log +
              `\nImported ${chunk.length} calendar entries…` +
              (index === calendarChunks.length - 1
                ? "\nImport successful!"
                : ""),
          });
        });
      }
    } catch (error) {
      this.setState({
        log: this.state.log + "\nImport failed:\n" + error.message,
      });
    }
  };

  render() {
    const { userID, anonymous, userName, signOut } = this.props;
    const { log } = this.state;

    return (
      <Fragment>
        <Header>
          <nav className="user">
            {userID ? (
              <React.Fragment>
                <p className="username">{userName}</p>
                <Link to="/">Back to app</Link>
              </React.Fragment>
            ) : (
              "Authenticating…"
            )}
          </nav>
        </Header>

        <div className="section">
          <h1 className="section-title">
            Import data from <a href="https://kausi.xyz">kausi.xyz</a>
          </h1>
          <p>
            If you've used the first version of Kausi, you can import your data
            from there to here. Please be aware doing this will overwrite any
            existing data that conflicts with data in the import.
          </p>
          <ol>
            <li>
              Sign in to your old account at{" "}
              <a href="https://kausi.xyz">https://kausi.xyz</a>.
            </li>
            <li>
              Go to{" "}
              <a href="https://kausi.xyz/account/">
                https://kausi.xyz/account/
              </a>{" "}
              and click "Fetch your entries"
            </li>
            <li>
              Select all and copy your data from the text field that appears,
              then paste it here &darr;, and click "Import".
            </li>
          </ol>

          {log && (
            <pre>
              <code>{log}</code>
            </pre>
          )}

          <form className="import-form" onSubmit={this.handleSubmit}>
            <textarea
              className="import-field"
              rows={5}
              placeholder="Paste your data here…"
              name="importData"
            />
            <button className="import-button" type="submit">
              Import
            </button>
          </form>
        </div>

        <Footer />
      </Fragment>
    );
  }
}

export default Authentication;
