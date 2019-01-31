import React from "react";
import PropTypes from "prop-types";
import SaveIndicator from "../shared/SaveIndicator";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import LanguagePageContent from "./LanguagePageContent";
import { Route } from "react-router-dom";

const tabs = [
  /*"All",*/ "Translation",
  "Linguistics",
  "Literacy",
  "Media",
  "People",
  "Events"
];

export default class LanguagePage extends React.PureComponent {
  state = {};

  render() {
    const language = this.props.language;
    const t = this.props.t;
    return (
      <div>
        <SaveIndicator
          t={this.props.t}
          saving={this.state.saving}
          saved={this.state.savedChanges}
        />
        <h2>{language.name}</h2>
        <Route
          path={this.props.basePath + "/:domain?"}
          render={({ match, history }) => (
            <Tabs
              selectedIndex={selectedTab(
                match.params.domain,
                this.props.viewPrefs.dashboardTab
              )}
              onSelect={index => {
                this.props.updateViewPrefs({ dashboardTab: tabs[index] });
                history.push(`${this.props.basePath}/${tabs[index]}`);
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
                    replaceLanguage={this.props.replaceLanguage}
                    setNetworkError={this.props.setNetworkError}
                    location={this.props.location}
                    basePath={match.url}
                    history={this.props.history}
                  />
                </TabPanel>
              ))}
            </Tabs>
          )}
        />
      </div>
    );
  }
}

function selectedTab(urlDomain, viewPrefsDomain) {
  let domain = urlDomain || viewPrefsDomain;
  const index = tabs.indexOf(domain);
  return index < 0 ? 0 : index;
}

LanguagePage.propTypes = {
  replaceLanguage: PropTypes.func.isRequired,
  setNetworkError: PropTypes.func.isRequired,
  basePath: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  language: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  viewPrefs: PropTypes.object.isRequired,
  updateViewPrefs: PropTypes.func.isRequired
};