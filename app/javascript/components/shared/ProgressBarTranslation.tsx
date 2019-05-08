import React, { useContext } from "react";
import Activity from "../../models/Activity";
import ProgressBarMulti from "./ProgressBarMulti";
import I18nContext from "../../contexts/I18nContext";

interface IProps {
  progress: {
    [stage: string]: number;
  };
}

export default function ProgressBarTranslation(props: IProps) {
  const t = useContext(I18nContext);
  const bars = Object.keys(Activity.translationProgress)
    .reverse()
    .map(stage => ({
      color: Activity.translationProgress[stage].color,
      percent: props.progress[stage] || 0,
      tooltip: `${t(`stage_names.${stage}`)}: ${Math.round(
        props.progress[stage]
      )}%`
    }));
  return <ProgressBarMulti bars={bars} />;
}
