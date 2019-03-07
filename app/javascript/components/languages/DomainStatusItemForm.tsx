import React, { useContext, useState } from "react";
import DomainStatusItem, {
  IDomainStatusItem,
  DSICategories,
  DSISubcategories,
  AppPlatforms
} from "../../models/DomainStatusItem";
import I18nContext from "../../application/I18nContext";
import useKeepStateOnList from "../../util/useKeepStateOnList";
import { SelectGroup } from "../shared/formGroup";
import SelectInput from "../shared/SelectInput";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import { OrganizationPicker, PersonPicker } from "../shared/SearchPickers";
import P from "../shared/P";
import BooksSelector from "./BooksSelector";
import { JSEvent } from "../../models/TypeBucket";
import CheckBoxInput from "../shared/CheckboxInput";
import EditActionBar from "../shared/EditActionBar";

interface IProps {
  domainStatusItem?: IDomainStatusItem;
  categories?: DSICategories[];
  save: (item: IDomainStatusItem) => void;
  saving?: boolean;
  useEditActionBar?: boolean;
  cancel: () => void;
}

export default function DomainStatusItemForm(props: IProps) {
  const t = useContext(I18nContext);

  const categories: DSICategories[] = props.categories
    ? props.categories
    : Object.values(DSICategories);
  const [category, setCategory] = useState<DSICategories>(
    props.domainStatusItem ? props.domainStatusItem.category : categories[0]
  );

  const subcategories = DomainStatusItem.categoryList[category];
  const [subcategory, setSubcategory] = useState(
    props.domainStatusItem
      ? props.domainStatusItem.subcategory
      : subcategories[0]
  );
  useKeepStateOnList(subcategory, setSubcategory, subcategories);

  const [bibleBooksIds, setBibleBookIds] = useState(
    props.domainStatusItem ? props.domainStatusItem.bible_book_ids : []
  );

  const [android, setAndroid] = useState(
    props.domainStatusItem
      ? props.domainStatusItem.platforms.includes(AppPlatforms.Android)
      : false
  );
  const [ios, setIos] = useState(
    props.domainStatusItem
      ? props.domainStatusItem.platforms.includes(AppPlatforms.iOS)
      : false
  );

  const [year, setYear] = useState(
    props.domainStatusItem ? props.domainStatusItem.year : null
  );

  const [personId, setPersonId] = useState(
    props.domainStatusItem ? props.domainStatusItem.person_id : null
  );

  const [organizationId, setOrganizationId] = useState(
    props.domainStatusItem ? props.domainStatusItem.organization_id : null
  );

  const domainStatusItem: IDomainStatusItem = {
    category,
    subcategory,
    year,
    platforms: DomainStatusItem.platformsStr(android, ios),
    person_id: personId,
    organization_id: organizationId,
    bible_book_ids: bibleBooksIds,
    // Ignored by server:
    id: 0,
    language_id: 0,
    creator_id: 0
  };

  return (
    <div style={{ maxWidth: "600px" }}>
      {props.useEditActionBar && (
        <EditActionBar
          editing
          saving={props.saving}
          save={() => props.save(domainStatusItem)}
          cancel={props.cancel}
        />
      )}

      <SelectGroup
        label={t("Category")}
        handleChange={(e: JSEvent) => setCategory(e.target.value)}
        value={category}
        options={SelectInput.translatedOptions(categories, t)}
        autoFocus
      />

      <SelectGroup
        label={t("Subcategory")}
        handleChange={(e: JSEvent) => setSubcategory(e.target.value)}
        value={subcategory}
        options={SelectInput.translatedOptions(subcategories, t)}
      />

      {subcategory == DSISubcategories.Portions && (
        <P>
          <label>{t("Books")}</label>
          <BooksSelector bookIds={bibleBooksIds} setBookIds={setBibleBookIds} />
        </P>
      )}

      {category == DSICategories.ScriptureApp && (
        <P>
          <label>{t("Platform")}</label>
          <br />
          <CheckBoxInput value={android} setValue={setAndroid} text="Android" />
          <br />
          <CheckBoxInput value={ios} setValue={setIos} text="iOS" />
        </P>
      )}

      <P>
        <label>
          {t("Year")}
          <br />
          <input
            type="text"
            value={year || ""}
            size={4}
            onChange={e => setYear(parseInt(e.target.value))}
            style={{ width: "auto" }}
          />
        </label>
      </P>

      <P>
        <label>{t("Person")}</label>
        <PersonPicker
          selectedId={personId}
          setSelected={setPersonId}
          allowBlank
        />
      </P>

      <P>
        <label>{t("Organization")}</label>
        <OrganizationPicker
          selectedId={organizationId}
          setSelected={setOrganizationId}
          allowBlank
        />
      </P>

      {!props.useEditActionBar && (
        <SmallSaveAndCancel
          handleSave={() => {
            props.save(domainStatusItem);
          }}
          handleCancel={props.cancel}
          saveInProgress={props.saving}
        />
      )}
    </div>
  );
}
