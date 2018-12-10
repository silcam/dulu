import React from "react";
import PropTypes from "prop-types";
import style from "./EventsParticipantsTable.css";
import { Link } from "react-router-dom";

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
                  <Link key={cluster.id} to={`/clusters/${cluster.id}`}>
                    {cluster.name}
                  </Link>
                ))}
          </td>
        </tr>
        <tr>
          <th>{props.t("Languages")}</th>
          <td>
            {props.event.programs.length == 0
              ? props.t("None")
              : props.event.programs.map(program => (
                  <Link key={program.id} to={`/languages/${program.id}`}>
                    {program.name}
                  </Link>
                ))}
          </td>
        </tr>
        <tr>
          <th>{props.t("People")}</th>
          <td>
            {props.event.event_participants.length == 0
              ? props.t("None")
              : props.event.event_participants.map(participant => (
                  <Link
                    key={participant.id}
                    to={`/people/${participant.person_id}`}
                  >
                    {participant.full_name}
                  </Link>
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
