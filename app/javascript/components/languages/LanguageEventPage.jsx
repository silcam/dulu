import React from "react";
import PropTypes from "prop-types";
import EventContainer from "../events/EventContainer";
import { Link } from "react-router-dom";

export default class LanguageEventPage extends React.PureComponent {
  render() {
    const t = this.props.t;
    const language = this.props.language;

    return (
      <div>
        <h4>
          <Link to={this.props.basePath}>{`< ${language.name}`}</Link>
        </h4>

        <EventContainer
          id={this.props.eventId}
          t={t}
          setNetworkError={this.props.setNetworkError}
          history={this.props.history}
        />
      </div>
    );
  }
}

LanguageEventPage.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.object.isRequired,
  eventId: PropTypes.string.isRequired,
  basePath: PropTypes.string.isRequired,
  setNetworkError: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};
