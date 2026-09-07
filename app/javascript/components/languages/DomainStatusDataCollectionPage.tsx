import React, { useContext, useState } from "react";
import { DataCollection } from "../../models/DomainStatusItem";
import I18nContext from "../../contexts/I18nContext";
import { LanguageBackLink } from "../shared/BreadCrumbs";
import InlineAddIcon from "../shared/icons/InlineAddIcon";
import DomainStatusDataCollectionView from "./DomainStatusDataCollectionView";
import DomainStatusNew from "./DomainStatusNew";
import { useLoadOnMount } from "../shared/useLoad";
import { useLanguageContext } from "./LanguagePageRouter";
import { useParams } from "react-router-dom";

export default function DomainStatusDataCollectionPage() {
  const { language, basePath } = useLanguageContext();
  const collectionType = useParams().collectionType as DataCollection;
  const props = { language, basePath, collectionType };
  const t = useContext(I18nContext);

  useLoadOnMount(`/api/languages/${props.language.id}/domain_status_items`);

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
          cancel={() => setAdding(false)}
        />
      )}

      <DomainStatusDataCollectionView
        {...props}
        basePath={`${props.basePath}/domain_status_items`}
      />
    </div>
  );
}
