import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ParticipantContainer from "../languages/ParticipantContainer";

export default class ClusterParticipantPage extends React.PureComponent {
  render() {
    const cluster = this.props.cluster;
    return (
      <div>
        <h4>
          <Link to={this.props.basePath}>{`< ${cluster.name}`}</Link>
        </h4>
        <ParticipantContainer id={this.props.participantId} {...this.props} />
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
