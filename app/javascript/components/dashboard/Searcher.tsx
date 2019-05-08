import React, { useState, useContext, useEffect } from "react";
import TextInput from "../shared/TextInput";
import styles from "./Searcher.css";
import I18nContext from "../../contexts/I18nContext";
import useSearch from "../shared/useSearch";
import { withRouter, RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";

const minQueryLength = 3;

export interface SearchResult {
  title: string;
  route?: string;
  description: string;
  subresults?: { results: SearchResult[] };
  level?: number;
}

interface IProps extends RouteComponentProps {
  setSeacherActive: (a: boolean) => void;
}

function BasicSearcher(props: IProps) {
  const t = useContext(I18nContext);
  const [query, setQuery] = useState("");
  const [selectedPosition, setSelectedPosition] = useState(-1);

  const results = useSearch<SearchResult>(`/api/search`, query, minQueryLength);
  const flatResults = results ? flattenResults(results) : undefined;

  useEffect(() => {
    props.setSeacherActive(query.length > 0);
  });

  const handleKeyDown = (key: string) => {
    if (flatResults === undefined) return;
    switch (key) {
      case "ArrowDown":
        setSelectedPosition(
          Math.min(selectedPosition + 1, flatResults.length - 1)
        );
        break;
      case "ArrowUp":
        setSelectedPosition(Math.max(selectedPosition - 1, -1));
        break;
      case "Enter":
        const index = Math.max(selectedPosition, 0);
        if (flatResults[index] && flatResults[index].route)
          props.history.push(flatResults[index].route!);
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
      {flatResults !== undefined &&
        (flatResults.length == 0 ? (
          <p>No Results</p>
        ) : (
          <table className="table">
            <tbody>
              {flatResults.map((result, index) => (
                <tr key={index}>
                  <td
                    style={{
                      paddingLeft: 8 + 8 * result.level!,
                      border: result.level! > 0 ? "none" : undefined
                    }}
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

function flattenResults(results: SearchResult[], level = 0) {
  return results.reduce((flatResults: SearchResult[], result) => {
    flatResults.push({ ...result, level });
    if (result.subresults) {
      flatResults.concat(flattenResults(result.subresults.results, level + 1));
    }
    return flatResults;
  }, []);
}

const Searcher = withRouter(BasicSearcher);

export default Searcher;
