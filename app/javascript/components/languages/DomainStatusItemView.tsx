import React, { useContext } from "react";
import DomainStatusItem, {
  IDomainStatusItem,
  GrammarTypes,
  DiscourseTypes,
  countUnit,
  DataCollection,
  countText
} from "../../models/DomainStatusItem";
import { IPerson } from "../../models/Person";
import { IOrganization } from "../../models/Organization";
import { ILanguage } from "../../models/Language";
import I18nContext from "../../contexts/I18nContext";
import { orBlank } from "../../util/orBlank";
import { Link } from "react-router-dom";
import List from "../../models/List";
import TextOrYesNo from "../shared/TextOrYesNo";
import ReadonlyCheck from "../shared/ReadonlyCheck";
import styles from "./DomainStatus.css";
import Spacer from "../shared/Spacer";
import DivInline from "../shared/DivInline";
import capitalize from "../../util/capitalize";

interface IProps {
  language: ILanguage;
  item: IDomainStatusItem;
  people: List<IPerson>;
  organizations: List<IOrganization>;
}

export default function DomainStatusItemView(props: IProps) {
  const t = useContext(I18nContext);

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
          <tr>
            <th>{t("Organization")}</th>
            <td>
              {props.item.organization_id && (
                <Link to={`/organizations/${props.item.organization_id}`}>
                  {DomainStatusItem.orgName(props.item, props.organizations)}
                </Link>
              )}
            </td>
          </tr>
          <tr>
            <th>{t("Person")}</th>
            <td>
              {props.item.person_id && (
                <Link to={`/people/${props.item.person_id}`}>
                  {DomainStatusItem.personName(props.item, props.people)}
                </Link>
              )}
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
