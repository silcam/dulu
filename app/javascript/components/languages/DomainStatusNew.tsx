import React from "react";
import {
  DSICategory,
  DSISubcategories,
  IDomainStatusItem
} from "../../models/DomainStatusItem";
import DomainStatusItemForm from "./DomainStatusItemForm";
import { ILanguage } from "../../models/Language";
import useLoad from "../shared/useLoad";

interface IProps {
  language: ILanguage;
  categories: DSICategory[];
  subcategory?: DSISubcategories;
  cancel: () => void;
}

export default function DomainStatusNew(props: IProps) {
  const [load, loading] = useLoad();
  const save = async (item: IDomainStatusItem) => {
    await load(duluAxios =>
      duluAxios.post(
        `/api/languages/${props.language.id}/domain_status_items`,
        item
      )
    );
    props.cancel();
  };

  return (
    <DomainStatusItemForm
      save={item => {
        save(item);
      }}
      saving={loading}
      categories={props.categories}
      subcategory={props.subcategory}
      cancel={props.cancel}
    />
  );
}
