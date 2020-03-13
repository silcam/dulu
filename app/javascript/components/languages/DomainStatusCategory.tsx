import React, { useContext } from "react";
import { IDomainStatusItem, DSICategory } from "../../models/DomainStatusItem";
import I18nContext from "../../contexts/I18nContext";
import styles from "./DomainStatus.css";

interface IProps {
  category: DSICategory;
  label?: string;
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
      <td className={styles.categoryHeader}>
        {props.label || t(props.category)}
      </td>
      <td>{props.render(categoryDomainStatusItems)}</td>
    </tr>
  );
}
