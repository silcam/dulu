import React, { useContext, useState, useEffect } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { ById } from "../../models/TypeBucket";
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

interface Match {
  display: string;
  url: string;
  matched: string;
}

interface Matcher<T> {
  (item: T, q: string): Match | undefined;
}

interface IProps extends RouteComponentProps {
  people: ById<IPerson>;
  organizations: ById<IOrganization>;
  languages: ById<ILanguage>;
  clusters: ById<ICluster>;
  regions: ById<IRegion>;
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
  let matches = searchItems(
    q,
    props.languages,
    textMatcher("/languages", l => l.name)
  )
    .concat(
      searchItems(q, props.people, textMatcher("/people", p => fullName(p)))
    )
    .concat(
      searchItems(
        q,
        props.organizations,
        textMatcher("/organizations", o => o.short_name)
      )
    )
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

function textMatcher<T extends { id: number }>(
  baseUrl: string,
  getText: (item: T) => string
) {
  return (item: T, q: string) => {
    const text = getText(item);
    const matchText = accentFold(text);
    if (matchText.includes(q))
      return {
        display: text,
        matched: matchText,
        url: `${baseUrl}/${item.id}`
      };
  };
}

function searchItems<T>(q: string, byId: ById<T>, checkMatch: Matcher<T>) {
  return (Object.values(byId) as T[]).reduce(
    (matches, item) => {
      const match = checkMatch(item, q);
      if (match) matches.push(match);
      return matches;
    },
    [] as Match[]
  );
}

const GoBar = connect((state: AppState) => ({
  people: state.people.byId,
  organizations: state.organizations.byId,
  languages: state.languages.byId,
  clusters: state.clusters.byId,
  regions: state.regions.byId
}))(withRouter(BaseGoBar));

export default GoBar;
