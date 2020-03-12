import React, { useState } from "react";
import styles from "./SearchTextInput.css";

interface ListItem {
  id: number;
  name: string;
}

interface IProps {
  list: ListItem[];
  value: ListItem;
  setValue: (listItem: ListItem) => void;
  startFocused?: boolean;
}

export default function TyperPicker(props: IProps) {
  const [focused, setFocused] = useState(!!props.startFocused);

  const handleType = (name: string) => {
    const item = props.list.find(li => li.name == name);
    props.setValue(item ? item : { id: 0, name });
  };

  return (
    <div className={styles.searchTextInput}>
      <input
        type="text"
        value={props.value.name}
        onChange={e => handleType(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {focused && (
        <ul>
          {props.list.map(listItem => (
            <li key={listItem.id} onMouseDown={() => props.setValue(listItem)}>
              {listItem.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
