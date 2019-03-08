import React, { useContext } from "react";
import DomainStatusItem, {
  IDomainStatusItem,
  DSICategories,
  DSISubcategories
} from "../../models/DomainStatusItem";
import { ById } from "../../models/TypeBucket";
import { IPerson } from "../../models/Person";
import { IOrganization } from "../../models/Organization";
import { ILanguage } from "../../models/Language";
import I18nContext from "../../application/I18nContext";
import { orBlank } from "../../util/orBlank";

interface IProps {
  language: ILanguage;
  item: IDomainStatusItem;
  people: ById<IPerson>;
  organizations: ById<IOrganization>;
}

export default function DomainStatusItemView(props: IProps) {
  const t = useContext(I18nContext);

  return (
    <div>
      <h2>{`${t(props.item.category)}: ${t(props.item.subcategory)}`}</h2>
      <table>
        <tbody>
          {props.item.subcategory == DSISubcategories.Portions && (
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
            <th>{t("Year")}</th>
            <td>{orBlank(props.item.year)}</td>
          </tr>
          <tr>
            <th>{t("Organization")}</th>
            <td>{DomainStatusItem.orgName(props.item, props.organizations)}</td>
          </tr>
          <tr>
            <th>{t("Person")}</th>
            <td>{DomainStatusItem.personName(props.item, props.people)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
