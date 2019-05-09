import React, { useState } from "react";
import styles from "./SearchTextInput.css";
import accentFold from "../../util/accentFold";
import { ById } from "../../models/TypeBucket";
import { fullName, IPerson } from "../../models/Person";
import { IOrganization } from "../../models/Organization";

interface SearchItemType {
  id: number;
  name?: string;
}

interface CorePickerProps<T extends SearchItemType> {
  collection: ById<T>;
  placeholder?: string;
  autoFocus?: boolean;
  allowBlank?: boolean;
  autoClear?: boolean;
  nameOf?: (item: T) => string;
}

interface SearchPickerProps<T extends SearchItemType>
  extends CorePickerProps<T> {
  selectedId: number | null;
  setSelected: (item: T | null) => void;
}

export default function SearchPicker<T extends SearchItemType>(
  props: SearchPickerProps<T>
) {
  const nameOf = props.nameOf || stdNameOf;
  const selectedItem = props.selectedId && props.collection[props.selectedId];

  const [text, setText] = useState(selectedItem ? nameOf(selectedItem) : "");
  const [editing, setEditing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const updateText = (text: string) => {
    setText(text);
    setEditing(text.length > 0);
    setActiveIndex(-1);
    if (props.allowBlank && text == "") props.setSelected(null);
  };

  const filteredList = Object.values(props.collection).filter(
    item => item && accentFold(nameOf(item)).includes(accentFold(text))
  ) as T[];

  const save = (item: T) => {
    setText(props.autoClear ? "" : nameOf(item));
    setEditing(false);
    props.setSelected(item);
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
          {filteredList.map((item, index) => {
            const className = index == activeIndex ? styles.selected : "";
            return (
              <li
                key={item.id}
                className={className}
                onMouseDown={() => save(item)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {nameOf(item)}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function stdNameOf<T extends SearchItemType>(item: T) {
  return item.name ? item.name : `${item}`;
}

interface SearchPickerAutoClearProps<T extends SearchItemType>
  extends CorePickerProps<T> {
  setSelected: (value: T) => void;
}
export function SearchPickerAutoClear<T extends SearchItemType>(
  props: SearchPickerAutoClearProps<T>
) {
  const { setSelected, ...otherProps } = props;
  return (
    <SearchPicker
      selectedId={null}
      setSelected={value => value && setSelected(value)}
      autoClear
      {...otherProps}
    />
  );
}

export function PersonPicker(props: SearchPickerProps<IPerson>) {
  return <SearchPicker nameOf={person => fullName(person)} {...props} />;
}

export function PersonPickerAutoClear(
  props: SearchPickerAutoClearProps<IPerson>
) {
  return (
    <SearchPickerAutoClear nameOf={person => fullName(person)} {...props} />
  );
}

export function OrganizationPicker(props: SearchPickerProps<IOrganization>) {
  return <SearchPicker nameOf={org => org.short_name} {...props} />;
}

export function OrganizationPickerAutoClear(
  props: SearchPickerAutoClearProps<IOrganization>
) {
  return <SearchPickerAutoClear nameOf={org => org.short_name} {...props} />;
}
