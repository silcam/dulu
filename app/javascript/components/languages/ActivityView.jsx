import React from "react";
import PropTypes from "prop-types";
import ProgressBar from "../shared/ProgressBar";
import Activity from "../../models/Activity";
import Participant from "../../models/Participant";
import { Link } from "react-router-dom";
import styles from "./ActivityView.css";
import * as ArrayUtils from "../../util/arrayUtils";

export default function ActivityView(props) {
  const activity = props.activity;
  const t = props.t;
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <ProgressBar {...Activity.progress(activity)} />
        <span style={{ marginLeft: "8px" }}>
          {Activity.currentStageName(activity, t)}
        </span>
      </div>

      <h3>{t("People")}</h3>
      <ul className={styles.stdList}>
        {Participant.participantsForActivity(props.language, activity).map(
          participant => (
            <li key={participant.id}>
              <Link to={`${props.basePath}/participants/${participant.id}`}>
                {participant.person.full_name}
              </Link>
              {" - "}
              {ArrayUtils.print(participant.roles, t, "roles")}
            </li>
          )
        )}
      </ul>
    </div>
  );
}

ActivityView.propTypes = {
  t: PropTypes.func.isRequired,
  activity: PropTypes.object.isRequired,
  language: PropTypes.object.isRequired,
  basePath: PropTypes.string.isRequired
};
