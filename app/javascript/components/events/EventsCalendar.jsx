import React from "react";
import PropTypes from "prop-types";
import DuluAxios from "../../util/DuluAxios";
import style from "./EventsCalendar.css";
import { Link } from "react-router-dom";
import {
  monthBefore,
  monthAfter,
  monthName,
  periodToGetParams
} from "./dateUtils";
import AddIcon from "../shared/icons/AddIcon";
import NewEventFormContainer from "./NewEventFormContainer";
import MonthColumnContainer from "./MonthColumnContainer";

export default class EventsCalendar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const period = {
      start: monthBefore(this.centerMonth()),
      end: monthAfter(this.centerMonth())
    };
    this.getEvents(period);
    this.preloadEvents();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.year != prevProps.year ||
      this.props.month != prevProps.month
    )
      this.preloadEvents();
  }

  preloadEvents = () => {
    const leftOfLeft = monthBefore(monthBefore(this.centerMonth()));
    const rightOfRight = monthAfter(monthAfter(this.centerMonth()));
    this.getEvents({ start: leftOfLeft, end: leftOfLeft });
    this.getEvents({ start: rightOfRight, end: rightOfRight });
  };

  getEvents = async period => {
    try {
      const data = await DuluAxios.get(
        "/api/events",
        periodToGetParams(period)
      );
      this.props.addPeople(data.people);
      this.props.addLanguages(data.languages);
      this.props.addClusters(data.clusters);
      this.props.setEventsCan(data.can);
      this.props.addEvents(data.events, period);
    } catch (error) {
      this.props.setNetworkError(error);
    }
  };

  centerMonth = () => ({
    year: parseInt(this.props.year),
    month: parseInt(this.props.month)
  });

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
            {this.props.can.create && (
              <AddIcon
                iconSize="large"
                onClick={() => this.setState({ addingNew: true })}
              />
            )}
          </h2>
          {this.state.addingNew && (
            <NewEventFormContainer
              t={t}
              cancelForm={() => this.setState({ addingNew: false })}
              setNetworkError={this.props.setNetworkError}
              replaceWorkshop={() => {}}
            />
          )}
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
          <MonthColumnContainer t={this.props.t} month={left} />
          <MonthColumnContainer t={this.props.t} month={center} />
          <MonthColumnContainer t={this.props.t} month={right} />
        </div>
      </div>
    );
  }
}

EventsCalendar.propTypes = {
  t: PropTypes.func.isRequired,
  setNetworkError: PropTypes.func.isRequired,
  year: PropTypes.string.isRequired,
  month: PropTypes.string.isRequired,
  addEvents: PropTypes.func.isRequired,
  setEventsCan: PropTypes.func.isRequired,
  addPeople: PropTypes.func.isRequired,
  addLanguages: PropTypes.func.isRequired,
  addClusters: PropTypes.func.isRequired,
  can: PropTypes.object.isRequired
};
