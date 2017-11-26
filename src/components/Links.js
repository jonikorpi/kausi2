import React from "react";
import {
  format,
  lastDayOfMonth,
  startOfMonth,
  subMonths,
  addMonths,
} from "date-fns/esm";
import { Link } from "react-router-dom";

const Links = ({ today, activeDate }) => {
  const lastOfLastMonth = lastDayOfMonth(subMonths(activeDate, 1));
  const firstOfNextMonth = startOfMonth(addMonths(activeDate, 1));

  return (
    <nav className="links">
      <Link to={format(lastOfLastMonth, "/YYYY/M/D")}>Last month</Link>
      <Link to={format(firstOfNextMonth, "/YYYY/M/D")}>Next month</Link>
      <Link to={format(today, "/YYYY/M/D")}>Today</Link>
    </nav>
  );
};

export default Links;
