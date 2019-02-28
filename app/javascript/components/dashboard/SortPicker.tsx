import React, { useContext } from "react";
import HorizontalList from "../shared/HorizontalList";
import styles from "./SortPicker.css";
import I18nContext from "../../application/I18nContext";
import { SortOption, Sort } from "./sortActivities";

interface IProps {
  sort: Sort;
  options: SortOption[];
  changeSort: (s: Sort) => void;
}

function changeSort(
  newOption: SortOption,
  existingSort: Sort,
  callback: (s: Sort) => void
) {
  if (newOption != existingSort.option) {
    callback({
      option: newOption
    });
  } else {
    callback({
      option: existingSort.option,
      desc: !existingSort.desc
    });
  }
}

function SortPicker(props: IProps) {
  const t = useContext(I18nContext);
  const options = props.options;
  return (
    <div>
      <small>
        <HorizontalList>
          <li>
            <label>{t("Sort")}:</label>
          </li>
          {options.map(option => {
            let sortArrow = "";
            if (option == props.sort.option) {
              sortArrow = props.sort.desc ? "▼" : "▲";
            }
            return (
              <li key={option} className={styles.picker}>
                <button
                  className="link"
                  onClick={() => {
                    changeSort(option, props.sort, props.changeSort);
                    // e.target.blur();
                  }}
                >
                  {t(option)}
                  {sortArrow}
                </button>
              </li>
            );
          })}
        </HorizontalList>
      </small>
    </div>
  );
}

export default SortPicker;
