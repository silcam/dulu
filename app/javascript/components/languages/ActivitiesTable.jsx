import React from "react";
import PropTypes from "prop-types";
import ProgressBar from "../shared/ProgressBar";
import EditIcon from "../shared/icons/EditIcon";

export default function ActivitiesTable(props) {
  const language = props.language;
  return (
    <div>
      <h3>{props.t("Activities")}</h3>
      <table>
        <tbody>
          {showActivities("Translation", props.tab) &&
            language.translation_activities.map(activity => (
              <tr key={activity.id}>
                <td>{activity.name}</td>
                <td>
                  <ProgressBar
                    percent={activity.progress.percent}
                    color={activity.progress.color}
                  />
                </td>
                <td>{activity.stage_name}</td>
                <td>{activity.stage_date}</td>
                <td>
                  <EditIcon />
                </td>
              </tr>
            ))}
          {showActivities("Linguistics", props.tab) && (
            <React.Fragment>
              {language.linguistic_activities.research_activities.map(
                activity => (
                  <tr key={activity.id}>
                    <td>{activity.title}</td>
                  </tr>
                )
              )}
              {language.linguistic_activities.workshops_activities.map(
                activity => (
                  <tr key={activity.id}>
                    <td>{activity.title}</td>
                  </tr>
                )
              )}
            </React.Fragment>
          )}
          {showActivities("Media", props.tab) &&
            language.media_activities.map(activity => (
              <tr key={activity.id}>
                <td>{activity.name}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

function showActivities(domain, tab) {
  return tab == "All" || tab == domain;
}

ActivitiesTable.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.object.isRequired,
  tab: PropTypes.string.isRequired
};
