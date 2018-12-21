import React from "react";
import PropTypes from "prop-types";
import InlineAddIcon from "../shared/icons/InlineAddIcon";
import Event from "../../models/Event";
import update from "immutability-helper";
import EventRow from "./EventRow";
import { insertInto } from "../../util/arrayUtils";
import DuluAxios from "../../util/DuluAxios";

export default class EventsTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  addNewEvent = event => {
    const newEvents = insertInto(
      this.props.language.events,
      event,
      Event.revCompare
    );
    this.props.replaceLanguage(
      update(this.props.language, { events: { $set: newEvents } })
    );
    this.props.history.push(`${this.props.basePath}/events/${event.id}`);
  };

  moreEvents = async () => {
    this.setState({ loadingMore: true });
    try {
      const data = await DuluAxios.get(
        `/api/languages/${this.props.language.id}/more_events`,
        {
          offset: this.props.events.length
        }
      );
      this.props.replaceLanguage(
        update(this.props.language, {
          haveAllEvents: { $set: data.haveAllEvents },
          events: { $push: data.events }
        })
      );
    } catch (error) {
      console.error(error);
      this.props.setNetworkError(error);
    } finally {
      this.setState({ loadingMore: false });
    }
  };

  yearGroups = () => {
    return this.props.events.reduce((accum, event) => {
      const year = event.start_date.slice(0, 4);
      if (!accum[year]) accum[year] = [];
      accum[year].push(event);
      return accum;
    }, {});
  };

  render() {
    const t = this.props.t;
    const years = this.yearGroups();

    return (
      <div>
        <h3>
          {t("Events")}
          {!this.state.showNewForm && this.props.language.can.event.create && (
            <InlineAddIcon
              onClick={() =>
                this.props.history.push(`${this.props.basePath}/events/new`)
              }
            />
          )}
        </h3>
        <table>
          <tbody>
            {Object.keys(years)
              .sort()
              .reverse()
              .map(year => (
                <React.Fragment key={year}>
                  <tr>
                    <th>{year}</th>
                    <td />
                  </tr>
                  {years[year].map(event => (
                    <EventRow
                      key={event.id}
                      event={event}
                      t={t}
                      basePath={this.props.basePath}
                    />
                  ))}
                </React.Fragment>
              ))}
            {!this.props.language.haveAllEvents && (
              <tr>
                <td>
                  {this.state.loadingMore ? (
                    t("Loading")
                  ) : (
                    <button
                      className="link"
                      onClick={this.moreEvents}
                      style={{ fontWeight: "bold" }}
                    >
                      {t("More_events")}
                    </button>
                  )}
                </td>
                <td />
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}
EventsTable.propTypes = {
  language: PropTypes.object.isRequired,
  events: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  replaceLanguage: PropTypes.func.isRequired,
  setNetworkError: PropTypes.func.isRequired,
  domain: PropTypes.string,
  basePath: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  superEventsTable: PropTypes.bool
};
