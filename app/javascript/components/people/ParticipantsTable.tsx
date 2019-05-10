import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { IPerson } from "../../models/Person";
import I18nContext from "../../contexts/I18nContext";

interface IProps {
  person: IPerson;
}

export default function ParticipantsTable(props: IProps) {
  const t = useContext(I18nContext);
  const person = props.person;

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
