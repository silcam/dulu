import React from "react";
import PropTypes from "prop-types";
import InlineAddIcon from "../shared/icons/InlineAddIcon";
import NewEventForm from "./NewEventForm";
import Event from "../../models/Event";
import update from "immutability-helper";
import EventRow from "./EventRow";

export default class EventsTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  addNewEvent = event => {
    const newEvents = Event.addEventToEventsObj(
      this.props.language.events,
      event
    );
    this.props.replaceLanguage(
      update(this.props.language, { events: { $set: newEvents } })
    );
    this.setState({ showNewForm: false });
  };

  render() {
    const t = this.props.t;
    return (
      <div>
        <h3>
          {t("Events")}
          {!this.state.showNewForm && this.props.language.can.event.create && (
            <InlineAddIcon
              onClick={() => this.setState({ showNewForm: true })}
            />
          )}
        </h3>
        {this.state.showNewForm && (
          <NewEventForm
            t={t}
            cancelForm={() => this.setState({ showNewForm: false })}
            addNewEvent={this.addNewEvent}
            setNetworkError={this.props.setNetworkError}
            programId={this.props.language.id}
            defaultDomain={this.props.domain}
          />
        )}
        <table>
          <tbody>
            {this.props.events.map(event => (
              <EventRow key={event.id} event={event} t={t} />
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
  domain: PropTypes.string
};
