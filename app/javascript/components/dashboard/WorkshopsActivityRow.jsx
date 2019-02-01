import React from "react";
import { Link } from "react-router-dom";
import style from "./Dashboard.css";

function WorkshopEventLink(props) {
  const workshop = props.workshop;
  return (
    <Link
      to={`/languages/${props.languageId}/events/${workshop.event_id}`}
      className={props.className}
    >
      {workshop.name}
    </Link>
  );
}

function CompletedText(props) {
  let count = 0;
  for (let workshop of props.workshops) {
    if (workshop.completed) ++count;
  }
  return `${count}/${props.workshops.length}`;
}

class WorkshopsActivityRow extends React.PureComponent {
  render() {
    const activity = this.props.activity;

    return (
      <tr>
        <td>
          <Link to={`/languages/${activity.language_id}`}>
            {activity.language_name}
          </Link>
        </td>
        <td>
          <Link to={`/activities/${activity.id}`}>{activity.title}</Link>
        </td>
        <td>
          <CompletedText workshops={activity.workshops} />
        </td>
        <td className="">
          {activity.workshops.map((workshop, index) => {
            const sep = " - ";
            const style = {}; // workshop.completed ? {fontStyle: 'italic'} : {}
            const spanClass = workshop.completed ? "text-muted" : "";
            return (
              <span key={workshop.id} style={style} className={spanClass}>
                {workshop.event_id ? (
                  <WorkshopEventLink
                    workshop={workshop}
                    languageId={activity.language_id}
                    className={spanClass}
                  />
                ) : (
                  workshop.name
                )}
                {index < activity.workshops.length - 1 && sep}
              </span>
            );
          })}
        </td>
        <td className={style.reallySmall + " " + style.rightCol}>
          <i>{activity.last_update.slice(0, 10)}</i>
        </td>
      </tr>
    );
  }
}

export default WorkshopsActivityRow;
