import React, { useContext } from "react";
import {
  IDomainStatusItem,
  DSISubcategories
} from "../../models/DomainStatusItem";
import I18nContext from "../../contexts/I18nContext";
import { AnyJSX } from "../../models/TypeBucket";
import styles from "./DomainStatus.css";

interface IProps {
  subcategory: DSISubcategories;
  domainStatusItems: IDomainStatusItem[];
  showCheckbox?: boolean;
  checkboxChecked?: boolean;

  render?: (items: IDomainStatusItem[]) => AnyJSX;
  renderItem?: (item: IDomainStatusItem) => AnyJSX;
}

export default function DomainStatusSubcategory(props: IProps) {
  const t = useContext(I18nContext);
  const domainStatusItems = props.domainStatusItems.filter(
    item => item.subcategory == props.subcategory
  );

  const checkboxChecked =
    props.showCheckbox && props.checkboxChecked === undefined
      ? domainStatusItems.length > 0
      : props.checkboxChecked;

  return (
    <div className={styles.subcategory}>
      <h5
        className={
          props.showCheckbox && checkboxChecked
            ? styles.subcategoryHeader
            : styles.subcategoryHeaderUnchecked
        }
      >

        {t(props.subcategory)}
      </h5>
      {props.render ? (
        props.render(domainStatusItems)
      ) : props.renderItem ? (
        <ul>
          {domainStatusItems.map(item => (
            <li key={item.id} className={styles.ds_item}>
              {props.renderItem!(item)}
            </li>
          ))}
        </ul>
      ) : (
        <p>
          Need to specify either render or renderItem for
          DomainStatusSubcategory
        </p>
      )}
    </div>
  );
}
