import React, { useContext } from "react";
import { IDomainStatusItem, DSICategory } from "../../models/DomainStatusItem";
import I18nContext from "../../contexts/I18nContext";
import styles from "./DomainStatus.css";

interface IProps {
  category: DSICategory;
  label?: string;
  domainStatusItems: IDomainStatusItem[];
  // ReactNode, because that is what `<td>{props.render(...)}</td>` accepts and what the
  // renderers already return: DomainStatusFilms returns a bare string when the list is
  // empty, and an array containing nulls when it is not. The old `JSX.Element |
  // JSX.Element[]` was narrower than the truth and only compiled because `t` returned
  // `any`. See 8d.
  render: (items: IDomainStatusItem[]) => React.ReactNode;
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
