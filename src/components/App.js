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
  getWeekOfMonth,
  differenceInMilliseconds,
  isSameDay,
  isSameMonth,
  isWeekend,
  setYear,
  setMonth,
} from "date-fns/esm";

// import ListsData from "../components/ListsData";
import MonthData from "../components/MonthData";

const dateOptions = { weekStartsOn: 2 };
const startOfToday = () => startOfDay(Date.now());
const endOfToday = () => endOfDay(Date.now());

const pathsFromDay = day => ({
  yearly: `repeating/yearlies/${format(day, "MM")}/${format(day, "dd")}.txt`,
  monthly: "repeating/monthlies/" + format(day, "dd") + ".txt",
  weekly: "repeating/weeklies/" + format(day, "EEEE") + ".txt",
  daily: "repeating/dailies.txt",
  calendar: `calendar/${format(day, "YYYY")}/${format(day, "MM")}/${format(
    day,
    "dd"
  )}.txt`,
});

const isMonthInputSupported = () => {
  const monthInputTest = document.createElement("input");
  monthInputTest.type = "month";
  return monthInputTest.type === "text" ? false : true;
};
const monthInputSupported = isMonthInputSupported();

const getYearOptions = date => {
  const centerYear = +format(date, "YYYY");
  const years = [];
  for (let year = centerYear - 10; year <= centerYear + 10; year++) {
    years.push(year);
  }
  return years.map(year => (
    <option value={year} key={year}>
      {year}
    </option>
  ));
};
const getMonthOptions = date => {
  const months = [];
  for (let month = 1; month <= 12; month++) {
    months.push(month);
  }
  return months.map(month => (
    <option value={month} key={month}>
      {format(setMonth(date, month - 1), "MMMM")}
    </option>
  ));
};

class App extends Component {
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown = event => {
    if (event.keyCode === 27 && document.activeElement) {
      /*esc*/ document.activeElement.blur();
    }
  };

  render() {
    return (
      <Fragment>
        <header className="section header">Kausi</header>
        <Calendar />
        {/* <Lists /> */}
        <footer className="section footer">
          Privacy policy | Terms of service | Developed by Vuoro Design
        </footer>
      </Fragment>
    );
  }
}

class Calendar extends Component {
  state = {
    today: startOfToday(),
    month: startOfMonth(startOfToday()),
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

  changeMonthAndYear = event => {
    const [year, month] = event.target.value.split("-");

    if (month && year) {
      this.setState({
        month: setMonth(
          setYear(startOfMonth(this.state.month), year),
          month - 1
        ),
      });
    }
  };

  changeMonth = event =>
    this.setState({
      month: setMonth(startOfMonth(this.state.month), event.target.value - 1),
    });
  changeYear = event =>
    this.setState({
      month: setYear(startOfMonth(this.state.month), event.target.value),
    });

  render() {
    const { today, month } = this.state;

    const days = [...Array(getDaysInMonth(month))].map((value, index) =>
      addDays(month, index)
    );

    const weeks = days.reduce((weeks, day) => {
      const week = getWeekOfMonth(day, dateOptions) - 1;
      weeks[week] = weeks[week] || [];
      weeks[week].push(day);
      return weeks;
    }, []);

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
      <article className="section calendar">
        <div className="section-title">
          {monthInputSupported ? (
            <input
              type="month"
              defaultValue={format(month, "YYYY-MM")}
              className="selector month-and-year-selector"
              onChange={this.changeMonthAndYear}
            />
          ) : (
            <Fragment>
              <div className="selector month-selector">
                <select onChange={this.changeMonth} value={format(month, "M")}>
                  {getMonthOptions(month)}
                </select>
              </div>
              <div className="selector year-selector">
                <select
                  onChange={this.changeYear}
                  value={format(month, "YYYY")}
                >
                  {getYearOptions(month)}
                </select>
              </div>
            </Fragment>
          )}
        </div>

        <div className="grids">
          {Object.values(weeks).map((week, index) => (
            <div key={index} className="grid">
              {week.map(day => {
                const key = format(day, "dd-MM-YYYY");
                return (
                  <MonthData paths={pathsFromDay(day)}>
                    {(value, update) => (
                      <DayEntry
                        key={key}
                        id={key}
                        day={day}
                        value={value}
                        isToday={isSameDay(day, today)}
                        isWeekend={isWeekend(day)}
                        isEthereal={!isSameMonth(month, day)}
                      />
                    )}
                  </MonthData>
                );
              })}
            </div>
          ))}
        </div>
      </article>
    );
  }
}

// const Lists = () => {
//   const entries = [...Array(20)].map((value, index) => index);
//   const groups = entries.reduce((groups, entry) => {
//     const group = Math.floor(entry / 5);
//     groups[group] = groups[group] || [];
//     groups[group].push(entry);
//     return groups;
//   }, {});

//   return (
//     <article className="lists section">
//       <h1 className="section-title">Lists or whatever</h1>

//       <div className="grids">
//         {Object.values(groups).map((entries, index) => (
//           <div key={index} className="grid" style={{ "--gridWidth": 5 }}>
//             {entries.map(entry => (
//               <Entry key={entry}>
//                 {["lists/" + (entry + 1) + ".txt"].map(key => (
//                   <ListsData path={key} key={key}>
//                     {(value, update) => {
//                       return (
//                         <div className="editor">
//                           <Textarea
//                             className="textarea"
//                             id={key}
//                             value={value}
//                             onChange={update}
//                             minRows={3}
//                           />
//                         </div>
//                       );
//                     }}
//                   </ListsData>
//                 ))}
//               </Entry>
//             ))}
//           </div>
//         ))}
//       </div>
//     </article>
//   );
// };

class DayEntry extends React.PureComponent {
  handleOnChange = event =>
    this.props.onChange(this.props.id, event.nativeEvent.target.value);

  render() {
    const { id, day, value, isToday, isWeekend, isEthereal } = this.props;
    const classes = [
      "entry",
      ...Object.entries({
        today: isToday,
        weekend: isWeekend,
        ethereal: isEthereal,
      })
        .filter(className => className[1])
        .map(className => className[0]),
    ];

    return (
      <section className={classes.join(" ")}>
        <div className="entry-body">
          <div className="editor">
            <label htmlFor={id} className="editor-title">
              <span className="weekday">{format(day, "EEE")}</span>
              <span className="day">{format(day, " dd")}</span>
              <span className="month-and-year">
                {format(day, " MMMM YYYY")}
              </span>
            </label>
            <Textarea
              className="textarea"
              id={id}
              value={value}
              onChange={this.handleOnChange}
              minRows={3}
            />
          </div>
        </div>
      </section>
    );
  }
}

export default App;
