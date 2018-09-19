import React from "react";
import HorizontalList from "../shared/HorizontalList";

function changeSort(newOption, existingSort, callback) {
  if (newOption != existingSort.option) {
    callback({
      option: newOption,
      asc: true
    });
  } else {
    callback({
      option: existingSort.option,
      asc: !existingSort.asc
    });
  }
}

function SortPicker(props) {
  const options = props.options;
  return (
    <div>
      <small>
        <HorizontalList>
          <li>
            <label>{props.t("Sort")}:</label>
          </li>
          {options.map(option => {
            let sortArrow = "";
            if (option == props.sort.option) {
              sortArrow = props.sort.asc ? "▲" : "▼";
            }
            return (
              <li key={option}>
                <button
                  className="link"
                  onClick={e => {
                    changeSort(option, props.sort, props.changeSort);
                    e.target.blur();
                  }}
                >
                  {props.t(option)}
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
