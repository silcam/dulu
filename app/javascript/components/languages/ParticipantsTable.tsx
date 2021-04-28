import React, { useState } from "react";
import InlineAddIcon from "../shared/icons/InlineAddIcon";
import NewParticipantForm from "./NewParticipantForm";
import { domainFromRole } from "../../models/Role";
import { Link } from "react-router-dom";
import { fullName } from "../../models/Person";
import { ICluster } from "../../models/Cluster";
import { History } from "history";
import { IParticipantInflated, IParticipant } from "../../models/Participant";
import StyledTable from "../shared/StyledTable";
import { useLoadOnMount } from "../shared/useLoad";
import useParticipants from "../participants/useParticipants";
import useTranslation from "../../i18n/useTranslation";
import { ILanguage } from "../../models/Language";

/*
  Used by LanguagePageContent and ClusterPage!
*/

interface IProps {
  domain?: string;
  language?: ILanguage;
  cluster?: ICluster;
  can: { manage_participants?: boolean };
  basePath: string;
  history: History<any>;
}

export default function ParticipantsTable(props: IProps) {
  const t = useTranslation();
  const [showNewForm, setShowNewForm] = useState(false);

  const ptptFilter = props.language
    ? (ptpt: IParticipant) =>
      ptpt.language_id === props.language!.id ||
      (ptpt.cluster_id != undefined && ptpt.cluster_id === props.language!.cluster_id)
    : (ptpt: IParticipant) => ptpt.cluster_id === props.cluster!.id;
  const programParticipants = useParticipants(ptptFilter);

  useLoadOnMount(
    props.language
      ? `/api/languages/${props.language.id}/participants`
      : `/api/clusters/${props.cluster!.id}/participants`
  );

  const showCluster = (participant: IParticipantInflated) =>
    !!props.language && !!participant.cluster;

  const participants = domainPeople(
    programParticipants.toArray(),
    props.domain
  );

  return (
    <div>
      <h3>
        {t("People")}
        {props.can.manage_participants && (
          <InlineAddIcon onClick={() => setShowNewForm(true)} />
        )}
      </h3>
      {showNewForm && (
        <NewParticipantForm
          cancel={() => setShowNewForm(false)}
          language_id={props.language && props.language.id}
          cluster_id={props.cluster && props.cluster.id}
          history={props.history}
          basePath={props.basePath}
        />
      )}
      <StyledTable>
        <tbody>
          {participants.map((participant: IParticipantInflated) => (
            <tr key={participant.id}>
              <td>
                <Link to={`${props.basePath}/participants/${participant.id}`}>
                  {fullName(participant.person)}
                </Link>{" "}
                {showCluster(participant) && `(${participant.cluster!.name})`}
              </td>
              <td>
                {participant.roles.map(role => t(`roles.${role}`)).join(", ")}
              </td>
              <td>{participant.start_date}</td>
              <td>{participant.end_date}</td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </div>
  );
}

function domainPeople(participants: IParticipantInflated[], domain?: string) {
  if (!domain) return participants;
  return participants.filter(participant =>
    participant.roles.some(role => domainFromRole(role) == domain)
  );
}
