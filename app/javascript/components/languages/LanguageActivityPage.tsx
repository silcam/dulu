import React from "react";
import { Link } from "react-router-dom";
import ActivityContainer from "./ActivityContainer";
import { ILanguage } from "../../models/Language";

interface IProps {
  language: ILanguage;
  activityId: number;
  basePath: string;
}

export default function LanguageActivityPage(props: IProps) {
  return (
    <div className="padBottom">
      <h4>
        <Link to={props.basePath}>{`< ${props.language.name}`}</Link>
      </h4>
      <ActivityContainer {...props} />
    </div>
  );
}
