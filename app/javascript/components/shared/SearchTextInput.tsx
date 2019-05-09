import React, { useState } from "react";
import styles from "./SearchTextInput.css";
import useSearch from "./useSearch";

const MIN_QUERY_LENGTH = 2;

interface SearchItem {
  id: number;
  name: string;
}

const BLANK_ITEM = {
  id: null,
  name: ""
};

interface IProps {
  text?: string;
  queryPath: string;
  updateValue: (value: SearchItem | typeof BLANK_ITEM) => void;
  placeholder?: string;
  autoFocus?: boolean;
  allowBlank?: boolean;
  addBox?: boolean;
}

export default function SearchTextInput(props: IProps) {
  const [query, setQuery] = useState(props.text || "");
  const [showResults, setShowResults] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(-1);
  const results = useSearch<SearchItem>(
    props.queryPath,
    query,
    MIN_QUERY_LENGTH
  );

  const save = (item: SearchItem | typeof BLANK_ITEM) => {
    setQuery(props.addBox ? "" : item.name);
    setShowResults(false);
    props.updateValue(item);
  };

  const saveBlank = () => save(BLANK_ITEM);

  const updateQuery = (q: string) => {
    setQuery(q);
    setShowResults(true);
    if (q.length == 0 && props.allowBlank) saveBlank();
  };

  const handleKeyDown = (key: string) => {
    if (results === undefined) return;
    switch (key) {
      case "ArrowUp":
        setSelectedPosition(Math.max(selectedPosition - 1, -1));
        break;
      case "ArrowDown":
        setSelectedPosition(Math.min(selectedPosition + 1, results.length - 1));
        break;
      case "Enter":
      case "Tab":
        const index = Math.max(selectedPosition, 0);
        if (results[index]) save(results[index]);
        else saveBlank();
    }
  };

  const handleBlur = () => {
    if (props.allowBlank && query.length == 0) saveBlank();
    setShowResults(false);
  };

  const placeholder = props.placeholder || "";
  return (
    <div className={styles.searchTextInput}>
      <input
        type="text"
        name="query"
        value={query}
        onChange={e => updateQuery(e.target.value)}
        onKeyDown={e => handleKeyDown(e.key)}
        onBlur={handleBlur}
        placeholder={placeholder}
        autoFocus={props.autoFocus}
      />
      {showResults && results && (
        <ul onMouseLeave={() => setSelectedPosition(-1)}>
          {results.map((item, index) => {
            const className = index == selectedPosition ? styles.selected : "";
            return (
              <li
                key={item.id}
                className={className}
                onMouseDown={() => {
                  save(item);
                }}
                onMouseEnter={() => {
                  setSelectedPosition(index);
                }}
              >
                {item.name}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
