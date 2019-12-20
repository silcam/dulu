import React, { useState } from "react";
import styles from "./SearchTextInput.css";
import useSearch from "./useSearch";
import { PartialPerson, fullName } from "../../models/Person";
import { PartialOrganization } from "../../models/Organization";

const MIN_QUERY_LENGTH = 2;

export interface SearchItem {
  id: number;
  name: string;
}

interface IProps<T> {
  text?: string;
  queryPath: string;
  updateValue: (value: T | null) => void;
  display: (item: T) => string;
  notListed?: { label: string; onClick: (text: string) => void };
  placeholder?: string;
  autoFocus?: boolean;
  allowBlank?: boolean;
  addBox?: boolean;
}

export default function SearchTextInput<T>(props: IProps<T>) {
  const [query, setQuery] = useState(props.text || "");
  const [showResults, setShowResults] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(-1);
  const results = useSearch<T>(props.queryPath, query, MIN_QUERY_LENGTH);

  const save = (item: T) => {
    setQuery(props.addBox ? "" : props.display(item));
    setShowResults(false);
    props.updateValue(item);
  };

  const saveBlank = () => {
    setShowResults(false);
    props.updateValue(null);
  };

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
                key={index}
                className={className}
                onMouseDown={() => {
                  save(item);
                }}
                onMouseEnter={() => {
                  setSelectedPosition(index);
                }}
              >
                {props.display(item)}
              </li>
            );
          })}
          {props.notListed && (
            <li>
              <button
                className="link"
                onMouseDown={() => {
                  props.notListed!.onClick(query);
                  setShowResults(false);
                }}
              >
                {props.notListed.label}
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

type SimplifiedProps<T> = Omit<IProps<T>, "queryPath" | "display">;

export function PersonSearchTextInput(props: SimplifiedProps<PartialPerson>) {
  return SearchTextInput({
    ...props,
    queryPath: "/api/people/search",
    display: p => fullName(p)
  });
}

export function CountrySearchTextInput(props: SimplifiedProps<SearchItem>) {
  return SearchTextInput({
    ...props,
    queryPath: "/api/countries/search",
    display: c => c.name
  });
}

export function OrganizationSearchTextInput(
  props: SimplifiedProps<PartialOrganization>
) {
  return SearchTextInput<PartialOrganization>({
    ...props,
    queryPath: "/api/organizations/search",
    display: org => org.short_name
  });
}
