import React, { useContext } from "react";
import {
  DSICategories,
  IDomainStatusItem
} from "../../models/DomainStatusItem";
import I18nContext from "../../application/I18nContext";
import styles from "./DomainStatus.css";

interface IProps {
  category: DSICategories;
  domainStatusItems: IDomainStatusItem[];
  render: (items: IDomainStatusItem[]) => JSX.Element | JSX.Element[];
}

export default function DomainStatusCategory(props: IProps) {
  const t = useContext(I18nContext);
  const categoryDomainStatusItems = props.domainStatusItems.filter(
    item => item.category == props.category
  );
  return (
    <tr>
      <td className={styles.categoryHeader}>{t(props.category)}</td>
      <td>{props.render(categoryDomainStatusItems)}</td>
    </tr>
  );
}
