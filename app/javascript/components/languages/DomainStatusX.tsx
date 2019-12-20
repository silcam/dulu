import React from "react";
import { IDomainStatusItem, DSICategory } from "../../models/DomainStatusItem";
import DomainStatusPublishedScripture from "./DomainStatusPublishedScripture";
import DomainStatusAudioScripture from "./DomainStatusAudioScripture";
import DomainStatusScriptureApps from "./DomainStatusScriptureApps";
import DomainStatusFilms from "./DomainStatusFilms";
import DomainStatusDataCollection from "./DomainStatusDataCollection";
import DomainStatusResearch from "./DomainStatusResearch";
import useAppSelector from "../../reducers/useAppSelector";

interface IProps {
  category: DSICategory;
  domainStatusItems: IDomainStatusItem[];
  basePath: string;
}

export default function DomainStatusX(props: IProps) {
  const people = useAppSelector(state => state.people);
  const organizations = useAppSelector(state => state.organizations);

  const { category, ...otherProps } = { ...props, people, organizations };

  switch (category) {
    case "PublishedScripture":
      return <DomainStatusPublishedScripture {...otherProps} />;
    case "AudioScripture":
      return <DomainStatusAudioScripture {...otherProps} />;
    case "Film":
      return <DomainStatusFilms {...otherProps} />;
    case "ScriptureApp":
      return <DomainStatusScriptureApps {...otherProps} />;
    case "DataCollection":
      return <DomainStatusDataCollection {...otherProps} />;
    case "Research":
      return <DomainStatusResearch {...otherProps} />;
    // case "Community":
    //   return <DomainStatusCommunity {...otherProps} />;
    default:
      return null;
  }
}
