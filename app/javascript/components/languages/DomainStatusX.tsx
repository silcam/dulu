import React from "react";
import { IDomainStatusItem, DSICategory } from "../../models/DomainStatusItem";
import DomainStatusPublishedScripture from "./DomainStatusPublishedScripture";
import DomainStatusAudioScripture from "./DomainStatusAudioScripture";
import DomainStatusScriptureApps from "./DomainStatusScriptureApps";
import { IPerson } from "../../models/Person";
import { IOrganization } from "../../models/Organization";
import DomainStatusFilms from "./DomainStatusFilms";
import List from "../../models/List";
import DomainStatusDataCollection from "./DomainStatusDataCollection";
import DomainStatusResearch from "./DomainStatusResearch";
import DomainStatusCommunity from "./DomainStatusCommunity";

interface IProps {
  category: DSICategory;
  domainStatusItems: IDomainStatusItem[];
  people: List<IPerson>;
  organizations: List<IOrganization>;
  basePath: string;
}

export default function DomainStatusX(props: IProps) {
  const { category, ...otherProps } = props;
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
