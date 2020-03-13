import React, { useState, useEffect } from "react";
import styles from "./SearchTextInput.css";
import DuluAxios from "../../util/DuluAxios";
import { caseInsenstiveEqual } from "../../util/stringUtils";

interface ListItem {
  id: number;
  name: string;
}

interface IProps {
  // list: ListItem[];
  listUrl: string;
  value: ListItem | undefined | null;
  setValue: (listItem: ListItem) => void;
  startFocused?: boolean;
}

export default function TyperPicker(props: IProps) {
  const [focused, setFocused] = useState(!!props.startFocused);
  const [list, setList] = useState<ListItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    DuluAxios.get(props.listUrl).then(
      data => data && setList(data as ListItem[])
    );
  }, [props.listUrl]);

  const handleType = (name: string) => {
    const item = list.find(li => caseInsenstiveEqual(li.name, name));
    props.setValue(item ? item : { id: 0, name });
    setActiveIndex(-1);
  };

  const inputKeyPress = (key: string) => {
    switch (key) {
      case "ArrowDown":
        setActiveIndex(Math.min(activeIndex + 1, list.length - 1));
        return;
      case "ArrowUp":
        setActiveIndex(Math.max(activeIndex - 1, -1));
        return;
      case "Escape":
        setFocused(false);
        return;
      case "Enter":
      case "Tab":
        if (activeIndex >= 0) props.setValue(list[activeIndex]);
        setFocused(false);
        return;
    }
  };

  return (
    <div className={styles.searchTextInput}>
      <input
        type="text"
        value={props.value ? props.value.name : ""}
        disabled={list.length == 0}
        onChange={e => handleType(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={e => inputKeyPress(e.key)}
      />
      {focused && (
        <ul onMouseLeave={() => setActiveIndex(-1)}>
          {list.map((listItem, index) => (
            <li
              key={listItem.id}
              className={index == activeIndex ? styles.selected : ""}
              onMouseDown={() => props.setValue(listItem)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {listItem.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
