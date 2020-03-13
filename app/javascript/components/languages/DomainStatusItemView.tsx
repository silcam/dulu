import React, { useContext } from "react";
import DomainStatusItem, {
  IDomainStatusItem,
  GrammarTypes,
  DiscourseTypes,
  countUnit,
  DataCollection,
  countText
} from "../../models/DomainStatusItem";
import { fullName } from "../../models/Person";
import { ILanguage } from "../../models/Language";
import I18nContext from "../../contexts/I18nContext";
import { orBlank } from "../../util/orBlank";
import { Link } from "react-router-dom";
import TextOrYesNo from "../shared/TextOrYesNo";
import ReadonlyCheck from "../shared/ReadonlyCheck";
import styles from "./DomainStatus.css";
import Spacer from "../shared/Spacer";
import DivInline from "../shared/DivInline";
import capitalize from "../../util/capitalize";
import CommaList from "../shared/CommaList";
import useAppSelector from "../../reducers/useAppSelector";

interface IProps {
  language: ILanguage;
  item: IDomainStatusItem;
}

export default function DomainStatusItemView(props: IProps) {
  const t = useContext(I18nContext);

  const people = useAppSelector(state => state.people);
  const organizations = useAppSelector(state => state.organizations);

  return (
    <div>
      <h2>{`${t(props.item.category)}: ${t(props.item.subcategory)}`}</h2>
      <table className={styles.dsiView}>
        <tbody>
          {props.item.subcategory == "Portions" && (
            <tr>
              <th>{t("Books")}</th>
              <td>
                {DomainStatusItem.books(props.item, t).replace(/-/g, ", ")}
              </td>
            </tr>
          )}
          {props.item.category == "ScriptureApp" && (
            <tr>
              <th>{t("Platforms")}</th>
              <td>{props.item.platforms.replace("|", ", ")}</td>
            </tr>
          )}

          {["Research", "LiteracyMaterial"].includes(props.item.category) && (
            <tr>
              <th>{t("Title")}</th>
              <td>{props.item.title}</td>
            </tr>
          )}

          <tr>
            <th>{t("Description")}</th>
            <td>
              <div>{props.item.description}</div>
              {props.item.subcategory == "Orthography" && (
                <div style={{ marginTop: "16px" }}>
                  <ReadonlyCheck
                    value={props.item.details.toneOrthography}
                    label={t("ToneOrthography")}
                  />
                </div>
              )}
              {props.item.subcategory == "Grammar" && (
                <div style={{ marginTop: "16px" }}>
                  {GrammarTypes.map(grammarType => (
                    <DivInline key={grammarType}>
                      <ReadonlyCheck
                        value={!!props.item.details[grammarType]}
                        label={t(grammarType)}
                      />
                      <Spacer width={"20px"} />
                    </DivInline>
                  ))}
                </div>
              )}
              {props.item.subcategory == "Discourse" && (
                <div style={{ marginTop: "16px" }}>
                  {DiscourseTypes.map(discourseType => (
                    <DivInline key={discourseType}>
                      <ReadonlyCheck
                        value={!!props.item.details[discourseType]}
                        label={t(discourseType)}
                      />
                      <Spacer width="20px" />
                    </DivInline>
                  ))}
                </div>
              )}
            </td>
          </tr>

          {props.item.subcategory == "InformationalBook" && (
            <tr>
              <th>{t("Genre")}</th>
              <td>{t(props.item.details.informationGenre || "")}</td>
            </tr>
          )}

          {props.item.category == "DataCollection" && (
            <tr>
              <th>
                {capitalize(
                  countUnit(props.item.subcategory as DataCollection)
                )}
              </th>
              <td>{countText(props.item)}</td>
            </tr>
          )}

          {props.item.subcategory == "Orthography" && (
            <tr>
              <th>{t("ToneOrthography")}</th>
              <td>
                <TextOrYesNo
                  value={props.item.details.toneOrthography}
                  setValue={() => {}}
                />
              </td>
            </tr>
          )}
          <tr>
            <th>{t("Year")}</th>
            <td>{orBlank(props.item.year)}</td>
          </tr>
          {props.item.dsiLocation && (
            <tr>
              <th>{t("Location")}</th>
              <td>{props.item.dsiLocation.name}</td>
            </tr>
          )}
          <tr>
            <th>{t("Link")}</th>
            <td>
              <a href={props.item.link} target="_blank">
                {props.item.link}
              </a>
            </td>
          </tr>
          <tr>
            <th>{t("Organizations")}</th>
            <td>
              <CommaList
                list={props.item.organization_ids}
                render={id => (
                  <Link to={`/organizations/${id}`}>
                    {organizations.get(id).short_name}
                  </Link>
                )}
              />
            </td>
          </tr>
          <tr>
            <th>{t("People")}</th>
            <td>
              <CommaList
                list={props.item.person_ids}
                render={id => (
                  <Link to={`/people/${id}`}>{fullName(people.get(id))}</Link>
                )}
              />
            </td>
          </tr>
          {props.item.category == "Research" && (
            <tr>
              <th>{t("Completeness")}</th>
              <td>{props.item.completeness}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
