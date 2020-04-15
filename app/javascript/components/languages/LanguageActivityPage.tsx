import React from "react";
import { ILanguage } from "../../models/Language";
import { LanguageBackLink } from "../shared/BreadCrumbs";
import ActivityView from "./ActivityView";

interface IProps {
  language: ILanguage;
  activityId: number;
  basePath: string;
}

export default function LanguageActivityPage(props: IProps) {
  return (
    <div className="padBottom">
      <LanguageBackLink language={props.language} />
      <ActivityView {...props} />
    </div>
  );
}
