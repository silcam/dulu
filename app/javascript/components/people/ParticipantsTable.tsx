import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { IPerson } from "../../models/Person";
import I18nContext from "../../contexts/I18nContext";
import Participant from "../../models/Participant";
import useParticipants from "../participants/useParticipants";

interface IProps {
  person: IPerson;
}

export default function ParticipantsTable(props: IProps) {
  const t = useContext(I18nContext);
  const person = props.person;

  const participants = useParticipants(ptpt => ptpt.person_id == person.id);
  if (participants.length() == 0) return null;

  return (
    <div>
      <h3>{t("Language_programs")}</h3>
      <table className="table">
        <tbody>
          {participants.map(participant => {
            const clusterProgramPath = participant.language_id
              ? `/languages/${participant.language_id}`
              : `/clusters/${participant.cluster_id}`;
            return (
              <tr key={participant.id}>
                <td>
                  <Link to={clusterProgramPath}>
                    {Participant.clusterProgram(participant)?.name}
                  </Link>
                </td>
                <td className="subtle-links">
                  <Link to={`/participants/${participant.id}`}>
                    {participant.roles.map(r => t(`roles.${r}`)).join(", ")}
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
