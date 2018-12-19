import React from "react";
import ProgressBar from "../shared/ProgressBar";
import { Link } from "react-router-dom";
import style from "./Dashboard.css";
import Spacer from "../shared/Spacer";

class ResearchActivityRow extends React.PureComponent {
  render() {
    const activity = this.props.activity;
    return (
      <tr>
        <td>
          <Link to={`/programs/${activity.program_id}`}>
            {activity.program_name}
          </Link>
        </td>
        <td>
          <Link to={`/activities/${activity.id}`}>{activity.title}</Link>
        </td>
        <td className="progress-cell">
          <ProgressBar
            percent={activity.progress.percent}
            color={activity.progress.color}
          />
          <Spacer width="20px" />
          {activity.stage_name}
        </td>
        <td className={style.reallySmall + " " + style.rightCol}>
          <i>{activity.last_update.slice(0, 10)}</i>
        </td>
      </tr>
    );
  }
}

export default ResearchActivityRow;
