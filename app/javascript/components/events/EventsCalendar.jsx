import React from "react";
import PropTypes from "prop-types";
import DuluAxios from "../../util/DuluAxios";
import MonthColumn from "./MonthColumn";
import update from "immutability-helper";
import style from "./EventsCalendar.css";
import { Link } from "react-router-dom";

export default class EventsCalendar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      events: {}
    };
  }

  componentDidMount() {
    this.updateEvents();
  }

  componentDidUpdate() {
    this.updateEvents();
  }

  updateEvents = async () => {
    const center = this.centerMonth();
    const monthsToUpdate = [
      center,
      this.rightMonth(center),
      this.leftMonth(center)
    ];
    monthsToUpdate.forEach(month => {
      if (this.state.events[monthKey(month)] === undefined)
        this.fetchEvents(month);
    });
  };

  fetchEvents = async month => {
    this.setEvents(month, []);
    try {
      const data = await DuluAxios.get(
        `/api/events/find/${month.year}/${month.month}`
      );
      this.setEvents(month, data.events);
    } catch (error) {
      this.props.setNetworkError(error);
    }
  };

  setEvents = (month, events) => {
    this.setState(prevState => ({
      events: update(prevState.events, {
        [monthKey(month)]: { $set: events }
      })
    }));
  };

  centerMonth = () => {
    if (this.props.year && this.props.month)
      return {
        year: parseInt(this.props.year),
        month: parseInt(this.props.month)
      };
    const today = new Date();
    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1 // JS month is 0 based
    };
  };

  leftMonth = center => {
    return center.month == 1
      ? { year: center.year - 1, month: 12 }
      : { year: center.year, month: center.month - 1 };
  };

  rightMonth = center => {
    return center.month == 12
      ? { year: center.year + 1, month: 1 }
      : { year: center.year, month: center.month + 1 };
  };

  eventsFor(month) {
    return this.state.events[monthKey(month)] || [];
  }

  render() {
    const center = this.centerMonth();
    const left = this.leftMonth(center);
    const right = this.rightMonth(center);
    return (
      <div>
        <div>
          <Link to={`/events/${left.year}/${left.month}`}>Back</Link>
          <Link
            to={`/events/${right.year}/${right.month}`}
            style={{ float: "right" }}
          >
            Forward
          </Link>
        </div>
        <div className={style.calendar}>
          <MonthColumn
            t={this.props.t}
            events={this.eventsFor(left)}
            month={left}
          />
          <MonthColumn
            t={this.props.t}
            events={this.eventsFor(center)}
            month={center}
          />
          <MonthColumn
            t={this.props.t}
            events={this.eventsFor(right)}
            month={right}
          />
        </div>
      </div>
    );
  }
}

function monthKey(monthObj) {
  return `${monthObj.year}-${monthObj.month}`;
}

EventsCalendar.propTypes = {
  t: PropTypes.func.isRequired,
  setNetworkError: PropTypes.func.isRequired,
  year: PropTypes.string,
  month: PropTypes.string
};
