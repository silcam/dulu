import React from "react";

class ParticipantRow extends React.PureComponent {
  render() {
    const participant = this.props.participant;
    return (
      <tr>
        <td>
          <a href={`/programs/${participant.program_id}/`}>
            {participant.program_name}
          </a>
          &nbsp;
          {participant.clusterId && (
            <a href={`/clusters/${participant.cluster_id}/`}>
              ({participant.cluster_name})
            </a>
          )}
        </td>
        <td>
          <a href={`/participants/${participant.id}/`}>
            {participant.full_name}
          </a>
        </td>
        <td>{participant.roles.join(", ")}</td>
      </tr>
    );
  }
}

export default ParticipantRow;
