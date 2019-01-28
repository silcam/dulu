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
            {props.event.clusters.length == 0
              ? props.t("None")
              : props.event.clusters.map(cluster => (
                  <span key={cluster.id} className={style.listItem}>
                    <Link to={`/clusters/${cluster.id}`}>{cluster.name}</Link>
                  </span>
                ))}
          </td>
        </tr>
        <tr>
          <th>{props.t("Languages")}</th>
          <td>
            {props.event.programs.length == 0
              ? props.t("None")
              : props.event.programs.map(program => (
                  <span className={style.listItem} key={program.id}>
                    <Link to={`/languages/${program.id}`}>{program.name}</Link>
                  </span>
                ))}
          </td>
        </tr>
        <tr>
          <th>{props.t("People")}</th>
          <td>
            {props.event.event_participants.length == 0
              ? props.t("None")
              : props.event.event_participants.map(participant => (
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
  event: PropTypes.object.isRequired
};
