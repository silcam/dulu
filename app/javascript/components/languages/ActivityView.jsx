import React from "react";
import PropTypes from "prop-types";
import ProgressBar from "../shared/ProgressBar";
import Activity from "../../models/Activity";
import { Link } from "react-router-dom";
import styles from "./ActivityView.css";
import * as ArrayUtils from "../../util/arrayUtils";
import DuluAxios from "../../util/DuluAxios";
import Loading from "../shared/Loading";
import { fullName } from "../../models/Person";
import WorkshopActivity from "../workshops/WorkshopActivity";

export default class ActivityView extends React.PureComponent {
  async componentDidMount() {
    const data = await DuluAxios.get(
      `/api/activities/${this.props.activityId}`
    );
    if (data) {
      this.props.setLanguage(data.language);
      this.props.addPeople(data.people);
      this.props.addParticipants(data.participants);
      this.props.setActivity(data.activity);
    }
  }

  render() {
    const activity = this.props.activity;
    const t = this.props.t;

    if (!activity) return <Loading t={t} />;

    if (Activity.isWorkshops(activity))
      return <WorkshopActivity {...this.props} />;

    return (
      <div>
        <h2>{Activity.name(activity, t)}</h2>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <ProgressBar {...Activity.progress(activity)} />
          <span style={{ marginLeft: "8px" }}>
            {Activity.currentStageName(activity, t)}
          </span>
        </div>

        <h3>{t("People")}</h3>
        <ul className={styles.stdList}>
          {this.props.participants.map((participant, index) => (
            <li key={participant.id}>
              <Link
                to={`${this.props.basePath}/participants/${participant.id}`}
              >
                {fullName(this.props.people[index])}
              </Link>
              {" - "}
              {ArrayUtils.print(participant.roles, t, "roles")}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

ActivityView.propTypes = {
  t: PropTypes.func.isRequired,
  activity: PropTypes.object,
  participants: PropTypes.array,

  language: PropTypes.object.isRequired,
  basePath: PropTypes.string.isRequired,
  setLanguage: PropTypes.func.isRequired,
  addParticipants: PropTypes.func.isRequired,
  addPeople: PropTypes.func.isRequired,
  setActivity: PropTypes.func.isRequired
};
