import React, { useContext, useState, useEffect } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { IPerson, fullName } from "../../models/Person";
import { IOrganization } from "../../models/Organization";
import { ILanguage } from "../../models/Language";
import { ICluster } from "../../models/Cluster";
import { IRegion } from "../../models/Region";
import I18nContext from "../../contexts/I18nContext";
import { AppState } from "../../reducers/appReducer";
import { connect } from "react-redux";
import accentFold from "../../util/accentFold";
import styles from "./SearchTextInput.css";
import List from "../../models/List";

interface Match {
  display: string;
  url: string;
  matched: string;
}

interface Matcher<T> {
  (item: T, q: string): Match | null;
}

interface IProps extends RouteComponentProps {
  people: List<IPerson>;
  organizations: List<IOrganization>;
  languages: List<ILanguage>;
  clusters: List<ICluster>;
  regions: List<IRegion>;
}

const routes = [
  "languages",
  "people",
  "organizations",
  "clusters",
  "regions",
  "events",
  "reports"
];

function BaseGoBar(props: IProps) {
  const t = useContext(I18nContext);
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => setMatches(search(query, props)), [query]);

  const edit = (text: string) => {
    setQuery(text);
    setActiveIndex(0);
  };

  const goTo = (match: Match) => {
    props.history.push(match.url);
    setQuery("");
    setActiveIndex(0);
  };

  const inputKeyPress = (key: string) => {
    switch (key) {
      case "ArrowDown":
        setActiveIndex(Math.min(activeIndex + 1, matches.length - 1));
        return;
      case "ArrowUp":
        setActiveIndex(Math.max(activeIndex - 1, 0));
        return;
      case "Escape":
        setQuery("");
        setActiveIndex(0);
      case "Enter":
      case "Tab":
        if (query.length > 0 && matches.length > 0)
          goTo(matches[Math.max(activeIndex, 0)]);
        return;
    }
  };

  return (
    <div className={styles.searchTextInput}>
      <input
        type="text"
        value={query}
        onChange={e => edit(e.target.value)}
        placeholder={t("Go")}
        onKeyDown={e => inputKeyPress(e.key)}
        style={{ width: "180px", boxSizing: "border-box" }}
      />
      {matches.length > 0 && (
        <ul
          onMouseLeave={() => setActiveIndex(0)}
          style={{ width: "180px", marginTop: "-10px", marginLeft: "8px" }}
        >
          {matches.map((match, index) => (
            <li
              key={match.url}
              className={index == activeIndex ? styles.selected : ""}
              onMouseDown={() => goTo(match)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {match.display}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function search(query: string, props: IProps) {
  if (query.length == 0) return [];
  const q = accentFold(query);
  let matches = searchItems(q, props.languages, languageMatcher)
    .concat(
      searchItems(q, props.people, textMatcher("/people", p => fullName(p)))
    )
    .concat(searchItems(q, props.organizations, orgMatcher))
    .concat(
      searchItems(q, props.clusters, textMatcher("/clusters", c => c.name))
    )
    .concat(searchItems(q, props.regions, textMatcher("/regions", r => r.name)))
    .concat(
      routes
        .filter(route => route.includes(q))
        .map(route => ({
          display: capIt(route),
          url: "/" + route,
          matched: route
        }))
    );
  matches.sort((a, b) => {
    if (a.matched.startsWith(q) && !b.matched.startsWith(q)) return -1;
    if (b.matched.startsWith(q) && !a.matched.startsWith(q)) return 1;
    return 0;
  });
  return matches;
}

function capIt(s: string) {
  return s.slice(0, 1).toUpperCase() + s.slice(1);
}

function languageMatcher(language: ILanguage, q: string) {
  return (
    textMatcher("/languages", () => language.name)(language, q) ||
    textMatcher("/languages", () => language.code, () => language.name)(
      language,
      q
    )
  );
}

function orgMatcher(org: IOrganization, q: string) {
  return (
    textMatcher("/organizations", () => org.short_name)(org, q) ||
    textMatcher("/organizations", () => org.long_name)(org, q)
  );
}

function textMatcher<T extends { id: number }>(
  baseUrl: string,
  getText: (item: T) => string,
  displayText?: (item: T) => string
) {
  return (item: T, q: string) => {
    const text = getText(item);
    const matchText = accentFold(text);
    if (matchText.includes(q))
      return {
        display: displayText ? displayText(item) : text,
        matched: matchText,
        url: `${baseUrl}/${item.id}`
      };
    return null;
  };
}

function searchItems<T extends { id: number }>(
  q: string,
  list: List<T>,
  checkMatch: Matcher<T>
) {
  return list
    .map(item => checkMatch(item, q))
    .filter(match => match) as Match[];
}

const GoBar = connect((state: AppState) => ({
  people: state.people,
  organizations: state.organizations,
  languages: state.languages,
  clusters: state.clusters,
  regions: state.regions
}))(withRouter(BaseGoBar));

export default GoBar;
