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
  DataCollections,
  InformationGenre,
  InformationGenres,
  DSILocation
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
import { IPerson } from "../../models/Person";
import { IOrganization } from "../../models/Organization";
import useMergeState from "../../util/useMergeState";
import StyledTable, { TableStyleClass } from "../shared/StyledTable";
import { equals } from "../../util/arrayUtils";
import PersonPickerMulti from "../people/PersonPickerMulti";
import OrganizationPickerMulti from "../organizations/OrganizationPickerMulti";
import useAppSelector from "../../reducers/useAppSelector";
import { urlify } from "../../util/stringUtils";
import TyperPicker from "../shared/TyperPicker";

interface IProps {
  domainStatusItem?: IDomainStatusItem;
  categories?: DSICategory[];
  subcategory?: DSISubcategories;
  save: (item: DsiForServer) => void;
  saving?: boolean;
  useEditActionBar?: boolean;
  cancel: () => void;
}

export interface DsiForServer
  extends Omit<
    IDomainStatusItem,
    "id" | "language_id" | "creator_id" | "dsiLocation"
  > {
  dsi_location_id: number | null;
  new_dsi_location: string | null;
}

export default function DomainStatusItemForm(props: IProps) {
  const t = useContext(I18nContext);

  const allPeople = useAppSelector(state => state.people);
  const allOrganizations = useAppSelector(state => state.organizations);

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

  const [dsiLocation, setDsiLocation] = useState<DSILocation | undefined>(
    props.domainStatusItem && props.domainStatusItem.dsiLocation
  );

  const [link, setLink] = useState(
    props.domainStatusItem ? props.domainStatusItem.link : ""
  );

  const [people, setPeople] = useState<IPerson[]>(
    props.domainStatusItem
      ? props.domainStatusItem.person_ids.map(id => allPeople.get(id))
      : []
  );

  const [organizations, setOrganizations] = useState<IOrganization[]>(
    props.domainStatusItem
      ? props.domainStatusItem.organization_ids.map(id =>
          allOrganizations.get(id)
        )
      : []
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

  const domainStatusItem: DsiForServer = {
    category,
    subcategory,
    year,
    description,
    title,
    completeness,
    details,
    dsi_location_id: dsiLocation?.id ? dsiLocation.id : null,
    new_dsi_location:
      dsiLocation?.id == 0 && dsiLocation?.name ? dsiLocation.name : null,
    link: urlify(link),
    count: parseInt(count) || 0,
    platforms: DomainStatusItem.platformsStr(android, ios),
    person_ids: people.map(p => p.id),
    organization_ids: organizations.map(o => o.id),
    bible_book_ids: bibleBooksIds
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

      {["Research", "LiteracyMaterial"].includes(category) && (
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

      {subcategory == "InformationalBook" && (
        <FormGroup label={t("Genre")}>
          <SelectInput
            value={details.informationGenre || "Other"}
            setValue={genre =>
              setDetails({ informationGenre: genre as InformationGenre })
            }
            options={SelectInput.translatedOptions(InformationGenres, t)}
          />
        </FormGroup>
      )}

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

      {["Research", "DataCollection"].includes(category) && (
        <FormGroup label={t("Location")}>
          <TyperPicker
            listUrl="/api/dsi_locations"
            value={dsiLocation}
            setValue={setDsiLocation}
          />
        </FormGroup>
      )}

      <FormGroup label={t("Link")}>
        <TextInput value={link} setValue={setLink} placeholder="http://" />
      </FormGroup>

      <P>
        <label>{t("People")}</label>
        <PersonPickerMulti people={people} setPeople={setPeople} />
      </P>

      <P>
        <label>{t("Organizations")}</label>
        <OrganizationPickerMulti
          organizations={organizations}
          setOrganizations={setOrganizations}
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
