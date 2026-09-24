import React, { useState, useContext, useEffect } from "react";
import TextInput from "../shared/TextInput";
import styles from "./Searcher.css";
import I18nContext from "../../contexts/I18nContext";
import useSearch from "../shared/useSearch";
import { Link, useNavigate } from "react-router-dom";

const minQueryLength = 3;

// Flat, and deliberately. The server still nests child rows under some results --
// a person's programs, a cluster's languages -- and this component used to walk
// them into an indented list keyed by `level`. It never actually rendered one:
// the recursion ended in `flatResults.concat(...)`, whose return value was
// discarded, so no subresult has been displayed since the function was written
// (b2cc63c, Feb 2019). Rather than repair it, the hierarchy is gone: a search
// result is a way to reach a page, and every child it used to list is already on
// the page the parent links to -- PersonPage renders the person's participations,
// ClusterPage its languages. The server half is removed separately.
export interface SearchResult {
  title: string;
  route?: string;
  description: string;
}

interface IProps {
  setSeacherActive: (a: boolean) => void;
}

function Searcher(props: IProps) {
  const t = useContext(I18nContext);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedPosition, setSelectedPosition] = useState(-1);

  const { results, exact } = useSearch<SearchResult>(
    `/api/search`,
    query,
    minQueryLength
  );

  useEffect(() => {
    props.setSeacherActive(query.length > 0);
  });

  const handleKeyDown = (key: string) => {
    if (results === undefined) return;
    switch (key) {
      case "ArrowDown":
        setSelectedPosition(Math.min(selectedPosition + 1, results.length - 1));
        break;
      case "ArrowUp":
        setSelectedPosition(Math.max(selectedPosition - 1, -1));
        break;
      case "Enter": {
        // Same guard as SearchTextInput, for the same reason: without an arrow-key
        // selection this takes the top row, and until the current query's response
        // lands that row belongs to a prefix, which matches more than the query
        // does. Here it navigates somewhere wrong rather than saving something
        // wrong, which is cheaper but no more correct.
        if (selectedPosition < 0 && !exact) return;
        const index = Math.max(selectedPosition, 0);
        if (results[index] && results[index].route)
          navigate(results[index].route!);
      }
    }
  };

  return (
    <div className={styles.searcher}>
      <TextInput
        setValue={q => {
          setQuery(q);
          setSelectedPosition(-1);
        }}
        name="query"
        value={query}
        placeholder={t("Search_prompt")}
        handleKeyDown={handleKeyDown}
      />
      {results !== undefined &&
        (results.length == 0 ? (
          <p>No Results</p>
        ) : (
          <table className="table">
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td
                    className={index == selectedPosition ? styles.selected : ""}
                  >
                    {result.route ? (
                      <Link to={result.route}>{result.title}</Link>
                    ) : (
                      result.title
                    )}
                    &nbsp;
                    <small>{result.description}</small>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}
    </div>
  );
}

export default Searcher;
