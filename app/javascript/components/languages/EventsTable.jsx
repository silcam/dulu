import React from "react";
import PropTypes from "prop-types";
import InlineAddIcon from "../shared/icons/InlineAddIcon";
import Event from "../../models/Event";
import update from "immutability-helper";
import EventRow from "./EventRow";
import { insertInto } from "../../util/arrayUtils";

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

  render() {
    const t = this.props.t;
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
            {this.props.events.map(event => (
              <EventRow
                key={event.id}
                event={event}
                t={t}
                basePath={this.props.basePath}
              />
            ))}
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
  history: PropTypes.object.isRequired
};
