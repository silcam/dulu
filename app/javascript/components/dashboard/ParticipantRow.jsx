import React from "react";
import { Link } from "react-router-dom";

class ParticipantRow extends React.PureComponent {
  render() {
    const participant = this.props.participant;
    return (
      <tr>
        <td>
          <Link to={`/languages/${participant.language_id}/`}>
            {participant.language_name}
          </Link>
          &nbsp;
          {participant.clusterId && (
            <Link to={`/clusters/${participant.cluster_id}/`}>
              ({participant.cluster_name})
            </Link>
          )}
        </td>
        <td>
          <Link to={`/participants/${participant.id}/`}>
            {participant.full_name}
          </Link>
        </td>
        <td>{participant.roles.join(", ")}</td>
      </tr>
    );
  }
}

export default ParticipantRow;
