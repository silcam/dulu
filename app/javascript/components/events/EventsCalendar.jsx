import React from "react";
import PropTypes from "prop-types";
import DuluAxios from "../../util/DuluAxios";
import MonthColumn from "./MonthColumn";
import update from "immutability-helper";
import style from "./EventsCalendar.css";
import { Link } from "react-router-dom";
import { monthKey, monthBefore, monthAfter, monthName } from "./dateUtils";
import AddIcon from "../shared/icons/AddIcon";
import IfAllowed from "../shared/IfAllowed";

export default class EventsCalendar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      events: {},
      can: {}
    };
  }

  componentDidMount() {
    this.updateEvents();
  }

  componentDidUpdate() {
    this.updateEvents();
  }

  centerMonth = () => ({
    year: parseInt(this.props.year),
    month: parseInt(this.props.month)
  });

  updateEvents = async () => {
    const center = this.centerMonth();
    const monthsToUpdate = [monthBefore(center), center, monthAfter(center)];
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

  eventsFor(month) {
    return this.state.events[monthKey(month)] || [];
  }

  render() {
    const center = this.centerMonth();
    const left = monthBefore(center);
    const right = monthAfter(center);
    const t = this.props.t;
    return (
      <div className={style.container}>
        <div className={style.header}>
          <h2>
            {t("Events")}
            <IfAllowed
              can={this.state.can}
              permission="Event:create"
              setCan={can => this.setState({ can: can })}
              setNetworkError={this.props.setNetworkError}
            >
              <AddIcon iconSize="large" />
            </IfAllowed>
          </h2>
          <Link to={`/events/cal/${left.year}/${left.month}`} className="btn">
            {"< " + monthName(monthBefore(left).month, t)}
          </Link>
          <Link
            to={`/events/cal/${right.year}/${right.month}`}
            className="btn"
            style={{ float: "right" }}
          >
            {monthName(monthAfter(right).month, t) + " >"}
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

EventsCalendar.propTypes = {
  t: PropTypes.func.isRequired,
  setNetworkError: PropTypes.func.isRequired,
  year: PropTypes.string.isRequired,
  month: PropTypes.string.isRequired
};
