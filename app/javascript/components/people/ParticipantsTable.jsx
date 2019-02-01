import React from "react";
import { Link } from "react-router-dom";

class ParticipantsTable extends React.PureComponent {
  render() {
    const t = this.props.t;
    const person = this.props.person;

    if (person.participants.length == 0) return null;

    return (
      <div>
        <h3>{t("Language_programs")}</h3>
        <table className="table">
          <tbody>
            {person.participants.map(participant => {
              const clusterProgramPath = participant.language_id
                ? `/languages/${participant.language_id}`
                : `/clusters/${participant.cluster_id}`;
              return (
                <tr key={participant.id}>
                  <td>
                    <Link to={clusterProgramPath}>{participant.name}</Link>
                  </td>
                  <td className="subtle-links">
                    <Link to={`/participants/${participant.id}`}>
                      {participant.roles.join(", ")}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ParticipantsTable;
