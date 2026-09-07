import React from "react";
import { LanguageBackLink } from "../shared/BreadCrumbs";
import ActivityView from "./ActivityView";
import { useLanguageContext } from "./LanguagePageRouter";
import { useParams } from "react-router-dom";

export default function LanguageActivityPage() {
  const { language, basePath } = useLanguageContext();
  const activityId = parseInt(useParams().activityId!);

  return (
    <div className="padBottom">
      <LanguageBackLink language={language} />
      <ActivityView {...{ language, basePath, activityId }} />
    </div>
  );
}
