import React from "react";
import PropTypes from "prop-types";
import { findById, replace, deleteFrom } from "../../util/arrayUtils";
import update from "immutability-helper";
import ParticipantView from "./ParticipantView";
import { Link } from "react-router-dom";

export default class LanguageParticipantPage extends React.PureComponent {
  participant = () =>
    findById(this.props.language.participants, this.props.participantId);

  participantCan = () =>
    this.props.language.can.manage_participants
      ? { update: true, destroy: true }
      : {};

  replaceParticipant = participant => {
    this.props.replaceLanguage(
      update(this.props.language, {
        participants: {
          $set: replace(this.props.language.participants, participant)
        }
      })
    );
  };

  removeParticipant = () => {
    this.props.replaceLanguage(
      update(this.props.language, {
        participants: {
          $set: deleteFrom(
            this.props.language.participants,
            this.props.participantId
          )
        }
      })
    );
  };

  render() {
    const t = this.props.t;
    const language = this.props.language;
    const participant = this.participant();
    if (!participant) return "";

    return (
      <div>
        <h4>
          <Link to={this.props.basePath}>{`< ${language.name}`}</Link>
        </h4>
        <ParticipantView
          participant={participant}
          language={language}
          t={t}
          can={this.participantCan()}
          replaceParticipant={this.replaceParticipant}
          setNetworkError={this.props.setNetworkError}
          history={this.props.history}
          basePath={this.props.basePath}
          removeParticipant={this.removeParticipant}
        />
      </div>
    );
  }
}

LanguageParticipantPage.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.object.isRequired,
  participantId: PropTypes.string.isRequired,
  replaceLanguage: PropTypes.func.isRequired,
  setNetworkError: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  basePath: PropTypes.string.isRequired
};
