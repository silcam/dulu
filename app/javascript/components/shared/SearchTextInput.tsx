import React, { useEffect, useRef, useState } from "react";
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
  // A ref rather than state, and the distinction matters: this is written from an
  // event handler and read from an effect, never during render, so it neither causes
  // a render nor makes one impure. Holding it in state instead put a setState inside
  // the effect and so a cascading render on every answered query.
  const commitWhenAnswered = useRef(false);
  const { results, exact } = useSearch<T>(
    props.queryPath,
    query,
    MIN_QUERY_LENGTH
  );

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
    commitWhenAnswered.current = false;
    if (q.length == 0 && props.allowBlank) saveBlank();
  };

  // The other half of the Enter guard below. An Enter that arrives before the
  // current query has been answered is held, not dropped, and fires here when the
  // answer lands. Dropping it was the first attempt and it was worse than the bug in
  // one way: the dropdown can already be showing the right person -- the results for
  // one keystroke earlier -- so the user sees the name they want, presses Enter, and
  // nothing happens. regions.spec.js caught exactly that.
  //
  // Two suppressions, both measured rather than assumed. `save` and `saveBlank` are
  // rebuilt every render, so listing them as dependencies would run this effect on
  // every render -- which is harmless, since the guard returns immediately unless an
  // Enter is actually being held, but it is noise either way; the effect only needs
  // to reconsider when an answer arrives. And the setState rule is right in general
  // and wrong here: this is not a cascade. `save` sets state once, the re-render runs
  // the effect again, and the flag is already cleared, so it returns. Exactly one
  // extra render, and synchronising React state to an answer that arrived from
  // outside React is what an effect is for.
  useEffect(() => {
    if (!commitWhenAnswered.current || !exact || results === undefined) return;
    commitWhenAnswered.current = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (results[0]) save(results[0]);
    else saveBlank();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exact, results]);

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
      case "Tab": {
        // With no arrow-key selection, Enter means "take the top row" -- and that is
        // only safe when the rows are the answer to what is actually typed. While a
        // response is in flight the hook serves the longest cached prefix, and a
        // prefix of a multi-word query matches *more* than the query does, because
        // the server ORs the words: mid-way through typing "Drew Mambo", the query
        // "Drew M" returns everyone with an "m" in their name, ordered by last name,
        // so the top row is Lance Armstrong. Committing that saved the wrong person
        // to the form. A row the user pointed at is honoured either way -- that one
        // they can see. An unpointed Enter is held until the answer arrives; see the
        // effect above.
        if (selectedPosition < 0 && !exact) {
          commitWhenAnswered.current = true;
          return;
        }
        const index = Math.max(selectedPosition, 0);
        if (results[index]) save(results[index]);
        else saveBlank();
      }
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
