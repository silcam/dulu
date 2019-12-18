import React, { useContext, useState } from "react";
import DomainStatusItem, {
  IDomainStatusItem,
  DSICategories,
  DSISubcategories,
  DSICompleteness,
  DSIDetails,
  GrammarTypes,
  DiscourseTypes,
  DSICompletenesses,
  DSICategory,
  countUnit,
  DataCollection,
  DataCollections
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
import { OrganizationPicker } from "../shared/SearchPicker";
import { IPerson } from "../../models/Person";
import { IOrganization } from "../../models/Organization";
import List from "../../models/List";
import useMergeState from "../../util/useMergeState";
import StyledTable, { TableStyleClass } from "../shared/StyledTable";
import { equals } from "../../util/arrayUtils";
import PersonPicker from "../people/PersonPicker";

interface IProps {
  domainStatusItem?: IDomainStatusItem;
  categories?: DSICategory[];
  subcategory?: DSISubcategories;
  save: (item: IDomainStatusItem) => void;
  saving?: boolean;
  useEditActionBar?: boolean;
  cancel: () => void;
  people: List<IPerson>;
  organizations: List<IOrganization>;
}

export default function DomainStatusItemForm(props: IProps) {
  const t = useContext(I18nContext);

  const categories = props.categories ? props.categories : DSICategories;
  const [category, setCategory] = useState<DSICategory>(
    props.domainStatusItem ? props.domainStatusItem.category : categories[0]
  );

  const subcategories = props.subcategory
    ? [props.subcategory]
    : DomainStatusItem.categoryList[category];
  const [subcategory, setSubcategory] = useState(
    props.domainStatusItem
      ? props.domainStatusItem.subcategory
      : subcategories[0]
  );
  useKeepStateOnList(subcategory, setSubcategory, subcategories);

  const setCategoryAndSubcategory = (subcategory: DSISubcategories) => {
    const newCategory: DSICategory = DataCollections.includes(
      subcategory as DataCollection
    )
      ? "DataCollection"
      : "Research";
    setCategory(newCategory);
    setSubcategory(subcategory);
  };

  const [bibleBooksIds, setBibleBookIds] = useState(
    props.domainStatusItem ? props.domainStatusItem.bible_book_ids : []
  );

  const [android, setAndroid] = useState(
    props.domainStatusItem
      ? props.domainStatusItem.platforms.includes("Android")
      : false
  );
  const [ios, setIos] = useState(
    props.domainStatusItem
      ? props.domainStatusItem.platforms.includes("iOS")
      : false
  );

  const [description, setDescription] = useState(
    props.domainStatusItem ? props.domainStatusItem.description : ""
  );

  const [title, setTitle] = useState(
    props.domainStatusItem ? props.domainStatusItem.title : ""
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

  const [completeness, setCompleteness] = useState<DSICompleteness>(
    props.domainStatusItem ? props.domainStatusItem.completeness : "Draft"
  );

  const [details, setDetails] = useMergeState(
    props.domainStatusItem ? props.domainStatusItem.details : ({} as DSIDetails)
  );

  const [count, setCount] = useState(
    props.domainStatusItem ? String(props.domainStatusItem.count) : ""
  );

  const domainStatusItem: IDomainStatusItem = {
    category,
    subcategory,
    year,
    description,
    title,
    completeness,
    details,
    count: parseInt(count) || 0,
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

      {equals(categories, ["DataCollection", "Research"]) ? (
        <FormGroup label={t("Subcategory")}>
          <SelectInput
            setValue={subcategory =>
              setCategoryAndSubcategory(subcategory as DSISubcategories)
            }
            value={subcategory}
            options={SelectInput.translatedOptions(
              DomainStatusItem.lingSubcategories(),
              t
            )}
            autoFocus
          />
        </FormGroup>
      ) : (
        <React.Fragment>
          <FormGroup label={t("Category")}>
            <SelectInput
              setValue={category => setCategory(category as DSICategory)}
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
        </React.Fragment>
      )}

      {DataCollections.includes(subcategory as DataCollection) && (
        <FormGroup
          label={t(`Total_${countUnit(subcategory as DataCollection)}`)}
        >
          <TextInput value={count} setValue={v => setCount(v)} />
        </FormGroup>
      )}

      {subcategory == "Texts" && (
        <StyledTable styleClass={TableStyleClass.noBorder}>
          <tbody>
            {DiscourseTypes.map(discourseType => (
              <tr key={discourseType}>
                <td>{t(discourseType)}</td>
                <td>
                  <TextInput
                    value={
                      details[discourseType]
                        ? String(details[discourseType])
                        : ""
                    }
                    setValue={v => setDetails({ [discourseType]: parseInt(v) })}
                    name={discourseType}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      )}

      {subcategory == "Portions" && (
        <P>
          <label>{t("Books")}</label>
          <BooksSelector bookIds={bibleBooksIds} setBookIds={setBibleBookIds} />
        </P>
      )}

      {category == "ScriptureApp" && (
        <P>
          <label>{t("Platforms")}</label>
          <br />
          <CheckBoxInput value={android} setValue={setAndroid} text="Android" />
          <br />
          <CheckBoxInput value={ios} setValue={setIos} text="iOS" />
        </P>
      )}

      {category == "Research" && (
        <FormGroup label={t("Title")}>
          <TextInput value={title} setValue={(t: string) => setTitle(t)} />
        </FormGroup>
      )}

      <FormGroup label={t("Description")}>
        <TextInput
          value={description}
          setValue={(d: string) => setDescription(d)}
        />
      </FormGroup>

      {subcategory == "Orthography" && (
        <P>
          <CheckBoxInput
            text={t("ToneOrthography")}
            value={!!details.toneOrthography}
            setValue={toneOrthography => setDetails({ toneOrthography })}
          />
        </P>
      )}

      {subcategory == "Grammar" && (
        <P>
          {GrammarTypes.map(grammarType => (
            <div key={grammarType}>
              <CheckBoxInput
                text={t(grammarType)}
                value={!!details[grammarType]}
                setValue={v => setDetails({ [grammarType]: v })}
              />
            </div>
          ))}
        </P>
      )}

      {subcategory == "Discourse" && (
        <P>
          {DiscourseTypes.map(discourseType => (
            <div key={discourseType}>
              <CheckBoxInput
                text={t(discourseType)}
                value={!!details[discourseType]}
                setValue={v => setDetails({ [discourseType]: v })}
              />
            </div>
          ))}
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

      {["Research", "DataCollection"].includes(category) && (
        <FormGroup label={t("Completeness")}>
          <SelectInput
            value={completeness}
            setValue={c => setCompleteness(c as DSICompleteness)}
            options={SelectInput.translatedOptions(DSICompletenesses, t)}
          />
        </FormGroup>
      )}

      <P>
        <label>
          {t("Person")}
          <PersonPicker
            value={personId === null ? null : props.people.get(personId)}
            setValue={p => setPersonId(p && p.id)}
            placeholder=""
          />
        </label>
      </P>

      <P>
        <label>
          {t("Organization")}
          <OrganizationPicker
            collection={props.organizations}
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
