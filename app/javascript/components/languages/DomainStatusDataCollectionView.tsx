import React, { useContext } from "react";
import {
  revSortByDate,
  DataCollection,
  countUnit,
  DiscourseTypes,
  countText
} from "../../models/DomainStatusItem";
import { ILanguage } from "../../models/Language";
import { fullName } from "../../models/Person";
import I18nContext from "../../contexts/I18nContext";
import { Link } from "react-router-dom";
import capitalize from "../../util/capitalize";
import StyledTable from "../shared/StyledTable";
import CommaList from "../shared/CommaList";
import useAppSelector from "../../reducers/useAppSelector";

interface IProps {
  language: ILanguage;
  collectionType: DataCollection;
  basePath: string; // /languages/:id/domain_status_items
}

export default function DomainStatusDataCollectionView(props: IProps) {
  const t = useContext(I18nContext);

  const categoryItems = props.language.domain_status_items.filter(
    item => item.subcategory == props.collectionType
  );
  const items = revSortByDate(categoryItems);

  const people = useAppSelector(state => state.people);
  const organizations = useAppSelector(state => state.organizations);

  return (
    <div>
      <StyledTable>
        <tbody>
          <tr>
            <th>{t("Year")}</th>
            <th>{capitalize(t(countUnit(props.collectionType)))}</th>
            <th>{t("Completeness")}</th>
            <th>{t("Description")}</th>
            <th>{t("People")}</th>
            <th>{t("Organizations")}</th>
          </tr>
          {items.map(item => (
            <tr key={item.id}>
              <td>
                <Link to={`${props.basePath}/${item.id}`}>
                  {item.year ? item.year : "[----]"}
                </Link>
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
                <CommaList
                  list={item.person_ids}
                  render={id => (
                    <Link to={`/people/${id}`}>{fullName(people.get(id))}</Link>
                  )}
                />
              </td>
              <td>
                <CommaList
                  list={item.organization_ids}
                  render={id => (
                    <Link to={`/organizations/${id}`}>
                      {organizations.get(id).short_name}
                    </Link>
                  )}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </div>
  );
}
