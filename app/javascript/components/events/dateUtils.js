import Event from "../../models/Event";

// TODO - How many of these are no longer used?
// TODO - Prbly move the rest to util/Date.js

// return month object for the month prior to given month object
export function monthBefore(month) {
  return month.month == 1
    ? { year: month.year - 1, month: 12 }
    : { year: month.year, month: month.month - 1 };
}

// return month object for the month after given month object
export function monthAfter(month) {
  return month.month == 12
    ? { year: month.year + 1, month: 1 }
    : { year: month.year, month: month.month + 1 };
}

// Turns {year: 2018, month: 11} into "2018-11"
export function monthKey(monthObj) {
  return `${monthObj.year}-${monthObj.month}`;
}

// Long name of given month (1-12)
export function monthName(month, t) {
  return titleize(
    new Date(2018, month - 1).toLocaleString(t.locale, { month: "long" })
  );
}

// As an int
export function thisYear() {
  return new Date().getFullYear();
}

// As an int (1-12)
export function thisMonth() {
  return new Date().getMonth() + 1; // JS month is 0 indexed
}

export function eventInMonth(event, monthKey) {
  const monthEvent = {
    start_date: monthKey,
    end_date: monthKey
  };
  return Event.overlapCompare(event, monthEvent) == 0;
}

function titleize(word) {
  return word.slice(0, 1).toUpperCase() + word.slice(1);
}

export function periodToGetParams(period) {
  let params = {};
  if (period.start) {
    params.start_year = period.start.year;
    params.start_month = period.start.month;
  }
  if (period.end) {
    params.end_year = period.end.year;
    params.end_month = period.end.month;
  }
  return params;
}
