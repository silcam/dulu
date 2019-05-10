import React, { useContext, useState } from "react";
import DomainStatusItem, {
  IDomainStatusItem,
  DSICategories,
  DSISubcategories,
  AppPlatforms,
  ScripturePortion
} from "../../models/DomainStatusItem";
import I18nContext from "../../contexts/I18nContext";
import useKeepStateOnList from "../../util/useKeepStateOnList";
import SelectInput from "../shared/SelectInput";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import P from "../shared/P";
import BooksSelector from "./BooksSelector";
import CheckBoxInput from "../shared/CheckboxInput";
import EditActionBar from "../shared/EditActionBar";
import FormGroup from "../shared/FormGroup";
import TextInput from "../shared/TextInput";
import { PersonPicker, OrganizationPicker } from "../shared/SearchPicker";
import { IPerson } from "../../models/Person";
import { IOrganization } from "../../models/Organization";
import List from "../../models/List";

interface IProps {
  domainStatusItem?: IDomainStatusItem;
  categories?: DSICategories[];
  save: (item: IDomainStatusItem) => void;
  saving?: boolean;
  useEditActionBar?: boolean;
  cancel: () => void;
  people: List<IPerson>;
  organizations: List<IOrganization>;
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

  const [description, setDescription] = useState(
    props.domainStatusItem ? props.domainStatusItem.description : ""
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
    description: description,
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
          can={{}}
        />
      )}

      <FormGroup label={t("Category")}>
        <SelectInput
          setValue={category => setCategory(category as DSICategories)}
          value={category}
          options={SelectInput.translatedOptions(categories, t)}
          autoFocus
        />
      </FormGroup>

      <FormGroup label={t("Subcategory")}>
        <SelectInput
          setValue={subcategory =>
            setSubcategory(subcategory as DSISubcategories)
          }
          value={subcategory}
          options={SelectInput.translatedOptions(subcategories, t)}
        />
      </FormGroup>

      {subcategory == ScripturePortion.Portions && (
        <P>
          <label>{t("Books")}</label>
          <BooksSelector bookIds={bibleBooksIds} setBookIds={setBibleBookIds} />
        </P>
      )}

      {category == DSICategories.ScriptureApp && (
        <P>
          <label>{t("Platforms")}</label>
          <br />
          <CheckBoxInput value={android} setValue={setAndroid} text="Android" />
          <br />
          <CheckBoxInput value={ios} setValue={setIos} text="iOS" />
        </P>
      )}

      <FormGroup label={t("Description")}>
        <TextInput
          value={description}
          setValue={(d: string) => setDescription(d)}
        />
      </FormGroup>

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
        <label>
          {t("Person")}
          <PersonPicker
            collection={props.people.asById()}
            selectedId={personId}
            setSelected={person => setPersonId(person && person.id)}
            allowBlank
          />
        </label>
      </P>

      <P>
        <label>
          {t("Organization")}
          <OrganizationPicker
            collection={props.organizations.asById()}
            selectedId={organizationId}
            setSelected={org => setOrganizationId(org && org.id)}
            allowBlank
          />
        </label>
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
