import React from "react";
import {
  DSICategories,
  IDomainStatusItem
} from "../../models/DomainStatusItem";
import DomainStatusPublishedScripture from "./DomainStatusPublishedScripture";
import DomainStatusAudioScripture from "./DomainStatusAudioScripture";
import DomainStatusScriptureApps from "./DomainStatusScriptureApps";
import { IPerson } from "../../models/Person";
import { IOrganization } from "../../models/Organization";
import DomainStatusFilms from "./DomainStatusFilms";
import List from "../../models/List";

interface IProps {
  category: DSICategories;
  domainStatusItems: IDomainStatusItem[];
  people: List<IPerson>;
  organizations: List<IOrganization>;
  basePath: string;
}

export default function DomainStatusX(props: IProps) {
  const { category, ...otherProps } = props;
  switch (category) {
    case DSICategories.PublishedScripture:
      return <DomainStatusPublishedScripture {...otherProps} />;
    case DSICategories.AudioScripture:
      return <DomainStatusAudioScripture {...otherProps} />;
    case DSICategories.Film:
      return <DomainStatusFilms {...otherProps} />;
    case DSICategories.ScriptureApp:
      return <DomainStatusScriptureApps {...otherProps} />;
    default:
      return null;
  }
}
