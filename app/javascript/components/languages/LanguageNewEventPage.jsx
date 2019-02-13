import React from "react";
import PropTypes from "prop-types";
import NewEventFormContainer from "../events/NewEventFormContainer";
import { Link } from "react-router-dom";

export default class LanguageNewEventPage extends React.PureComponent {
  startEventInProps = () =>
    this.props.location.state && this.props.location.state.event;

  startEvent = () =>
    this.startEventInProps()
      ? this.props.location.state.event
      : {
          languages: [
            { id: this.props.language.id, name: this.props.language.name }
          ]
        };

  render() {
    const t = this.props.t;

    return (
      <div>
        <h4>
          <Link to={this.props.basePath}>{`< ${
            this.props.language.name
          }`}</Link>
        </h4>
        <NewEventFormContainer
          t={t}
          setNetworkError={this.props.setNetworkError}
          cancelForm={() => this.props.history.goBack()}
          startEvent={this.startEvent()}
        />
      </div>
    );
  }
}

LanguageNewEventPage.propTypes = {
  t: PropTypes.func.isRequired,
  location: PropTypes.object,
  history: PropTypes.object.isRequired,
  setNetworkError: PropTypes.func.isRequired,
  language: PropTypes.object.isRequired,
  basePath: PropTypes.string.isRequired
};
