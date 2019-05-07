import React, { useContext } from "react";
import style from "./EventsParticipantsTable.css";
import { Link } from "react-router-dom";
import { print } from "../../util/arrayUtils";
import { IEvent, IEventParticipantExtended } from "../../models/Event";
import { ICluster } from "../../models/Cluster";
import { ILanguage } from "../../models/Language";
import I18nContext from "../../application/I18nContext";

interface IProps {
  event: IEvent;
  eventClusters: ICluster[];
  eventLanguages: ILanguage[];
  eventParticipants: IEventParticipantExtended[];
}

export default function EventsParticipantsTable(props: IProps) {
  const t = useContext(I18nContext);
  return (
    <table className={style.eventParticipants}>
      <tbody>
        <tr>
          <th>{t("Clusters")}</th>
          <td>
            {props.eventClusters.length == 0
              ? t("None")
              : props.eventClusters.map(cluster => (
                  <span key={cluster.id} className={style.listItem}>
                    <Link to={`/clusters/${cluster.id}`}>{cluster.name}</Link>
                  </span>
                ))}
          </td>
        </tr>
        <tr>
          <th>{t("Languages")}</th>
          <td>
            {props.eventLanguages.length == 0
              ? t("None")
              : props.eventLanguages.map(language => (
                  <span className={style.listItem} key={language.id}>
                    <Link to={`/languages/${language.id}`}>
                      {language.name}
                    </Link>
                  </span>
                ))}
          </td>
        </tr>
        <tr>
          <th>{t("People")}</th>
          <td>
            {props.eventParticipants.length == 0
              ? t("None")
              : props.eventParticipants.map(participant => (
                  <span key={participant.id} className={style.listItem}>
                    <Link to={`/people/${participant.person_id}`}>
                      {participant.full_name}
                    </Link>
                    {participant.roles.length > 0 &&
                      ` (${print(participant.roles, t, "roles")})`}
                  </span>
                ))}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
