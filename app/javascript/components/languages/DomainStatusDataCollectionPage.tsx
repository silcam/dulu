import React, { useContext, useState } from "react";
import { DataCollection } from "../../models/DomainStatusItem";
import { ILanguage } from "../../models/Language";
import List from "../../models/List";
import { IPerson } from "../../models/Person";
import { IOrganization } from "../../models/Organization";
import I18nContext from "../../contexts/I18nContext";
import { useAPIGet } from "../../util/useAPI";
import { Setter, Adder } from "../../models/TypeBucket";
import { LanguageBackLink } from "../shared/BreadCrumbs";
import InlineAddIcon from "../shared/icons/InlineAddIcon";
import DomainStatusDataCollectionView from "./DomainStatusDataCollectionView";
import DomainStatusNew from "./DomainStatusNew";

interface IProps {
  language: ILanguage;
  collectionType: DataCollection;
  people: List<IPerson>;
  organizations: List<IOrganization>;
  basePath: string; // /languages/:id

  setLanguage: Setter<ILanguage>;
  addPeople: Adder<IPerson>;
  addOrganizations: Adder<IOrganization>;
}

export default function DomainStatusDataCollectionPage(props: IProps) {
  const t = useContext(I18nContext);
  const actions = {
    setLanguage: props.setLanguage,
    addPeople: props.addPeople,
    addOrganizations: props.addOrganizations
  };
  useAPIGet(
    `/api/languages/${props.language.id}/domain_status_items`,
    {},
    actions
  );

  const can = {
    add: props.language.can.update
  };
  const [adding, setAdding] = useState(false);

  return (
    <div className="padBottom">
      <LanguageBackLink language={props.language} />
      <h2>
        {t(props.collectionType)}
        {can.add && !adding && (
          <InlineAddIcon iconSize="large" onClick={() => setAdding(true)} />
        )}
      </h2>

      {adding && (
        <DomainStatusNew
          language={props.language}
          categories={["DataCollection"]}
          subcategory={props.collectionType}
          actions={actions}
          cancel={() => setAdding(false)}
          people={props.people}
          organizations={props.organizations}
        />
      )}

      <DomainStatusDataCollectionView
        {...props}
        basePath={`${props.basePath}/domain_status_items`}
      />
    </div>
  );
}
