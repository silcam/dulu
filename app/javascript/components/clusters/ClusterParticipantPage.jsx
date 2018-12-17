import React from "react";
import PropTypes from "prop-types";
import { findById, replace, deleteFrom } from "../../util/arrayUtils";
import { Link } from "react-router-dom";
import ParticipantView from "../languages/ParticipantView";
import update from "immutability-helper";

export default class ClusterParticipantPage extends React.PureComponent {
  participant = () =>
    findById(this.props.cluster.participants, this.props.participantId);

  participantCan = () =>
    this.props.cluster.can.manage_participants
      ? { update: true, destroy: true }
      : {};

  replaceParticipant = participant => {
    this.props.replaceCluster(
      update(this.props.cluster, {
        participants: {
          $set: replace(this.props.cluster.participants, participant)
        }
      })
    );
  };

  removeParticipant = () => {
    this.props.replaceCluster(
      update(this.props.cluster, {
        participants: {
          $set: deleteFrom(
            this.props.cluster.participants,
            this.props.participantId
          )
        }
      })
    );
  };

  render() {
    const t = this.props.t;
    const cluster = this.props.cluster;
    const participant = this.participant();
    if (!participant) return "";
    return (
      <div>
        <h4>
          <Link to={this.props.basePath}>{`< ${cluster.name}`}</Link>
        </h4>
        <ParticipantView
          participant={participant}
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

ClusterParticipantPage.propTypes = {
  t: PropTypes.func.isRequired,
  cluster: PropTypes.object.isRequired,
  participantId: PropTypes.string.isRequired,
  replaceCluster: PropTypes.func.isRequired,
  setNetworkError: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  basePath: PropTypes.string.isRequired
};
