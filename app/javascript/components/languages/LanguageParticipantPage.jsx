import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ParticipantContainer from "./ParticipantContainer";

export default class LanguageParticipantPage extends React.PureComponent {
  render() {
    const language = this.props.language;

    return (
      <div>
        <h4>
          <Link to={this.props.basePath}>{`< ${language.name}`}</Link>
        </h4>

        <ParticipantContainer {...this.props} id={this.props.participantId} />
      </div>
    );
  }
}

LanguageParticipantPage.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.object.isRequired,
  participantId: PropTypes.string.isRequired,

  history: PropTypes.object.isRequired,
  basePath: PropTypes.string.isRequired
};
