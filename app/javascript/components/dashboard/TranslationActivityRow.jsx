import React from "react";
import ProgressBar from "../shared/ProgressBar";
import { Link } from "react-router-dom";
import style from "./Dashboard.css";
import Spacer from "../shared/Spacer";

class TranslationActivityRow extends React.PureComponent {
  render() {
    const activity = this.props.activity;
    return (
      <tr>
        <td>
          <Link to={`/languages/${activity.language_id}/`}>
            {activity.language_name}
          </Link>
        </td>
        <td>
          {/* <Link to={`/activities/${activity.id}/`}>{activity.name}</Link> */}
          {activity.name}
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
          <i>
            {this.props.t("Updated")}: {activity.last_update.slice(0, 10)}
          </i>
        </td>
      </tr>
    );
  }
}

export default TranslationActivityRow;
