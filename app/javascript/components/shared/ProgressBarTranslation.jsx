import React from "react";
import PropTypes from "prop-types";
import Activity from "../../models/Activity";
import ProgressBarMulti from "./ProgressBarMulti";

export default function ProgressBarTranslation(props) {
  const bars = Object.keys(Activity.translationProgress)
    .reverse()
    .map(stage => ({
      color: Activity.translationProgress[stage].color,
      percent: props.progress[stage] || 0,
      tooltip: `${props.t(`stage_names.${stage}`)}: ${Math.round(
        props.progress[stage]
      )}%`
    }));
  return <ProgressBarMulti bars={bars} />;
}

ProgressBarTranslation.propTypes = {
  progress: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};
