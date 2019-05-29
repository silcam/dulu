import React from "react";
import ActivityContainer from "./ActivityContainer";
import { ILanguage } from "../../models/Language";
import { LanguageBackLink } from "../shared/BreadCrumbs";

interface IProps {
  language: ILanguage;
  activityId: number;
  basePath: string;
}

export default function LanguageActivityPage(props: IProps) {
  return (
    <div className="padBottom">
      <LanguageBackLink language={props.language} />
      <ActivityContainer {...props} />
    </div>
  );
}
