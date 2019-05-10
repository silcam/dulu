import React, { useContext } from "react";
import DomainStatusItem, {
  IDomainStatusItem,
  DSICategories,
  ScripturePortion
} from "../../models/DomainStatusItem";
import { IPerson } from "../../models/Person";
import { IOrganization } from "../../models/Organization";
import { ILanguage } from "../../models/Language";
import I18nContext from "../../contexts/I18nContext";
import { orBlank } from "../../util/orBlank";
import { Link } from "react-router-dom";
import List from "../../models/List";

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
      <table>
        <tbody>
          {props.item.subcategory == ScripturePortion.Portions && (
            <tr>
              <th>{t("Books")}</th>
              <td>
                {DomainStatusItem.books(props.item, t).replace(/-/g, ", ")}
              </td>
            </tr>
          )}
          {props.item.category == DSICategories.ScriptureApp && (
            <tr>
              <th>{t("Platforms")}</th>
              <td>{props.item.platforms.replace("|", ", ")}</td>
            </tr>
          )}
          <tr>
            <th>{t("Description")}</th>
            <td>{props.item.description}</td>
          </tr>
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
        </tbody>
      </table>
    </div>
  );
}
