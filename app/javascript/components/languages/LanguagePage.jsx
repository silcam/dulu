import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import LanguagePageContent from "./LanguagePageContent";
import { Route } from "react-router-dom";
import I18nContext from "../../contexts/I18nContext";
import ViewPrefsContext from "../../contexts/ViewPrefsContext";

const tabs = [
  /*"All",*/ "Translation",
  "Linguistics",
  "Literacy",
  "Media",
  "People",
  "Events"
];

export default function LanguagePage(props) {
  const t = useContext(I18nContext);
  const { viewPrefs, updateViewPrefs } = useContext(ViewPrefsContext);
  const language = props.language;

  return (
    <div>
      <h2>{language.name}</h2>
      <Route
        path={props.basePath + "/:domain?"}
        render={({ match, history }) => (
          <Tabs
            selectedIndex={selectedTab(
              match.params.domain,
              viewPrefs.dashboardTab
            )}
            onSelect={index => {
              updateViewPrefs({ dashboardTab: tabs[index] });
              history.push(`${props.basePath}/${tabs[index]}`);
              return true;
            }}
          >
            <TabList>
              {tabs.map(name => (
                <Tab key={name}>{t(name)}</Tab>
              ))}
            </TabList>
            {tabs.map(name => (
              <TabPanel key={name}>
                <LanguagePageContent
                  language={language}
                  tab={name}
                  t={t}
                  location={props.location}
                  basePath={match.url}
                  history={props.history}
                />
              </TabPanel>
            ))}
          </Tabs>
        )}
      />
    </div>
  );
}

function selectedTab(urlDomain, viewPrefsDomain) {
  let domain = urlDomain || viewPrefsDomain;
  const index = tabs.indexOf(domain);
  return index < 0 ? 0 : index;
}

LanguagePage.propTypes = {
  basePath: PropTypes.string.isRequired,
  language: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};
