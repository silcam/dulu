import React, { useContext } from "react";
import { sort } from "../../util/arrayUtils";
import I18nContext from "../../contexts/I18nContext";
import styles from "./MultiSelectItemList.css";

interface IProps<T> {
  items: readonly T[];
  display: (item: T) => string;
  removeItem: (item: T) => void;
  clear?: () => void;
  autoSort?: boolean;
}

export default function MultiSelectItemList<T>(props: IProps<T>) {
  const t = useContext(I18nContext);
  const items = props.autoSort ? sortedItems(props) : props.items;
  return (
    <div>
      {items.map((item, index) => (
        <span key={index} className={styles.item}>
          <button className="link" onClick={() => props.removeItem(item)}>
            {props.display(item)}
          </button>
        </span>
      ))}
      {items.length > 0 && props.clear && (
        <span className={styles.clear}>
          <button className="link" onClick={props.clear}>
            {t("Clear")}
          </button>
        </span>
      )}
    </div>
  );
}

function sortedItems<T>(props: IProps<T>) {
  return sort(props.items, (a: T, b: T) =>
    props.display(a).localeCompare(props.display(b))
  );
}
