import React, { useContext } from "react";
import DomainStatusItem, {
  revSortByDate,
  DataCollection,
  countUnit,
  DiscourseTypes,
  countText
} from "../../models/DomainStatusItem";
import { ILanguage } from "../../models/Language";
import List from "../../models/List";
import { IPerson } from "../../models/Person";
import { IOrganization } from "../../models/Organization";
import I18nContext from "../../contexts/I18nContext";
import { Link } from "react-router-dom";
import capitalize from "../../util/capitalize";
import StyledTable from "../shared/StyledTable";

interface IProps {
  language: ILanguage;
  collectionType: DataCollection;
  people: List<IPerson>;
  organizations: List<IOrganization>;
  basePath: string; // /languages/:id/domain_status_items
}

export default function DomainStatusDataCollectionView(props: IProps) {
  const t = useContext(I18nContext);

  const categoryItems = props.language.domain_status_items.filter(
    item => item.subcategory == props.collectionType
  );
  const items = revSortByDate(categoryItems);

  return (
    <div>
      <StyledTable>
        <tbody>
          <tr>
            <th>{t("Year")}</th>
            <th>{capitalize(t(countUnit(props.collectionType)))}</th>
            <th>{t("Completeness")}</th>
            <th>{t("Description")}</th>
            <th>{t("Person")}</th>
            <th>{t("Organization")}</th>
          </tr>
          {items.map(item => (
            <tr key={item.id}>
              <td>
                <Link to={`${props.basePath}/${item.id}`}>{item.year}</Link>
              </td>
              <td style={{ fontSize: "larger" }}>{countText(item)}</td>
              <td>{t(item.completeness)}</td>
              <td>
                <span>{item.description}</span>
                {DiscourseTypes.filter(d => item.details[d]).map(
                  discourseType => (
                    <div key={discourseType}>{`${
                      item.details[discourseType]
                    } ${t(discourseType)}`}</div>
                  )
                )}
              </td>
              <td>
                {item.person_id && (
                  <Link to={`/people/${item.person_id}`}>
                    {DomainStatusItem.personName(item, props.people)}
                  </Link>
                )}
              </td>
              <td>
                {item.organization_id && (
                  <Link to={`/organizations/${item.organization_id}`}>
                    {DomainStatusItem.orgName(item, props.organizations)}
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </div>
  );
}
