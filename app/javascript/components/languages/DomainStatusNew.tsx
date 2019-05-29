import React from "react";
import { DSICategory, DSISubcategories } from "../../models/DomainStatusItem";
import { useAPIPost, ActionPack } from "../../util/useAPI";
import DomainStatusItemForm from "./DomainStatusItemForm";
import { ILanguage } from "../../models/Language";
import { IPerson } from "../../models/Person";
import { IOrganization } from "../../models/Organization";
import List from "../../models/List";

interface IProps {
  language: ILanguage;
  categories: DSICategory[];
  subcategory?: DSISubcategories;
  actions: ActionPack;
  cancel: () => void;
  people: List<IPerson>;
  organizations: List<IOrganization>;
}

export default function DomainStatusNew(props: IProps) {
  const [saving, save] = useAPIPost(
    `/api/languages/${props.language.id}/domain_status_items`,
    {},
    props.actions
  );

  return (
    <DomainStatusItemForm
      save={item => {
        save(props.cancel, item);
      }}
      saving={saving}
      categories={props.categories}
      subcategory={props.subcategory}
      cancel={props.cancel}
      people={props.people}
      organizations={props.organizations}
    />
  );
}
