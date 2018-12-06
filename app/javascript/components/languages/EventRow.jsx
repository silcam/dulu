import React from "react";
import PropTypes from "prop-types";
import eventDateString from "../../util/eventDateString";
import { toggleStateFlag } from "../../util/toggleStateFlag";
import { Link } from "react-router-dom";
import style from "./EventsTable.css";

export default class EventRow extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  render() {
    const t = this.props.t;
    const event = this.props.event;
    return (
      <React.Fragment>
        <tr>
          <td className={this.state.expanded ? style.eventTitle : undefined}>
            <button
              className="link"
              onClick={() => toggleStateFlag(this, "expanded")}
            >
              {event.name}
            </button>
          </td>
          <td>
            {eventDateString(
              event.start_date,
              event.end_date,
              t("month_names_short")
            )}
          </td>
        </tr>
        {this.state.expanded && (
          <tr>
            <td className={style.rowExpansion} colSpan="2">
              <div>
                {event.note && <p>{event.note}</p>}
                <table className={style.eventParticipants}>
                  <tbody>
                    <tr>
                      <th>{t("Clusters")}</th>
                      <td>
                        {event.clusters.map(cluster => (
                          <Link key={cluster.id} to={`/clusters/${cluster.id}`}>
                            {cluster.name}
                          </Link>
                        ))}
                      </td>
                    </tr>
                    <tr>
                      <th>{t("Languages")}</th>
                      <td>
                        {event.programs.map(program => (
                          <Link
                            key={program.id}
                            to={`/languages/${program.id}`}
                          >
                            {program.name}
                          </Link>
                        ))}
                      </td>
                    </tr>
                    <tr>
                      <th>{t("People")}</th>
                      <td>
                        {event.event_participants.map(participant => (
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
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  }
}

EventRow.propTypes = {
  t: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired
};
