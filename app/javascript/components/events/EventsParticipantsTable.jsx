import React from "react";
import PropTypes from "prop-types";
import style from "./EventsParticipantsTable.css";
import { Link } from "react-router-dom";
import { print } from "../../util/arrayUtils";

export default function EventsParticipantsTable(props) {
  return (
    <table className={style.eventParticipants}>
      <tbody>
        <tr>
          <th>{props.t("Clusters")}</th>
          <td>
            {props.eventClusters == 0
              ? props.t("None")
              : props.eventClusters.map(cluster => (
                  <span key={cluster.id} className={style.listItem}>
                    <Link to={`/clusters/${cluster.id}`}>{cluster.name}</Link>
                  </span>
                ))}
          </td>
        </tr>
        <tr>
          <th>{props.t("Languages")}</th>
          <td>
            {props.eventLanguages.length == 0
              ? props.t("None")
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
          <th>{props.t("People")}</th>
          <td>
            {props.eventParticipants.length == 0
              ? props.t("None")
              : props.eventParticipants.map(participant => (
                  <span key={participant.id} className={style.listItem}>
                    <Link to={`/people/${participant.person_id}`}>
                      {participant.full_name}
                    </Link>
                    {participant.roles.length > 0 &&
                      ` (${print(participant.roles, props.t, "roles")})`}
                  </span>
                ))}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

EventsParticipantsTable.propTypes = {
  t: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired,
  eventClusters: PropTypes.array.isRequired,
  eventLanguages: PropTypes.array.isRequired,
  eventParticipants: PropTypes.array.isRequired
};
