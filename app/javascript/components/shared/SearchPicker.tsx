import React, { useState } from "react";
import styles from "./SearchTextInput.css";
import accentFold from "../../util/accentFold";

export interface PickerProps {
  list: number[];
  selectedId: number | null;
  setSelected: (id: number | null) => void;
  placeholder?: string;
  autoFocus?: boolean;
  allowBlank?: boolean;
  autoClear?: boolean;
}

export interface SearchPickerProps extends PickerProps {
  nameOf: (id: number) => string;
}

export default function SearchPicker(props: SearchPickerProps) {
  const [text, setText] = useState(
    props.selectedId ? props.nameOf(props.selectedId) : ""
  );
  const [editing, setEditing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const updateText = (text: string) => {
    setText(text);
    setEditing(text.length > 0);
    setActiveIndex(-1);
    if (props.allowBlank && text == "") props.setSelected(null);
  };

  const filteredList = props.list.filter(id =>
    accentFold(props.nameOf(id)).includes(accentFold(text))
  );

  const save = (id: number) => {
    setText(props.autoClear ? "" : props.nameOf(id));
    setEditing(false);
    props.setSelected(id);
  };

  const inputKeyPress = (key: string) => {
    switch (key) {
      case "ArrowDown":
        setActiveIndex(Math.min(activeIndex + 1, filteredList.length - 1));
        return;
      case "ArrowUp":
        setActiveIndex(Math.max(activeIndex - 1, -1));
        return;
      case "Enter":
      case "Tab":
        if (text.length > 0 && filteredList.length > 0)
          save(filteredList[Math.max(activeIndex, 0)]);
        return;
    }
  };

  const placeholder = props.placeholder || "";
  return (
    <div className={styles.searchTextInput}>
      <input
        type="text"
        name="query"
        value={text}
        onChange={e => updateText(e.target.value)}
        onKeyDown={e => inputKeyPress(e.key)}
        onBlur={() => setEditing(false)}
        placeholder={placeholder}
        autoFocus={props.autoFocus}
      />
      {editing && (
        <ul onMouseLeave={() => setActiveIndex(-1)}>
          {filteredList.map((id, index) => {
            const className = index == activeIndex ? styles.selected : "";
            return (
              <li
                key={id}
                className={className}
                onMouseDown={() => save(id)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {props.nameOf(id)}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
