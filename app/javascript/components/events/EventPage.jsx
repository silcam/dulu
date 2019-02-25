import React from "react";
import PropTypes from "prop-types";
import EventContainer from "./EventContainer";

export default class EventPage extends React.PureComponent {
  render() {
    const t = this.props.t;

    return (
      <EventContainer id={this.props.id} t={t} history={this.props.history} />
    );
  }
}

EventPage.propTypes = {
  id: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};
