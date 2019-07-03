import React, { useContext } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import LanguagePageContent from "./LanguagePageContent";
import { Route } from "react-router-dom";
import I18nContext from "../../contexts/I18nContext";
import ViewPrefsContext from "../../contexts/ViewPrefsContext";
import { ILanguage } from "../../models/Language";
import { Location, History } from "history";

export type LanguagePageTab =
  | "Translation"
  | "Linguistics"
  | "Literacy"
  | "Media"
  | "People"
  | "Events";

const tabs: LanguagePageTab[] = [
  /*"All",*/ "Translation",
  "Linguistics",
  "Literacy",
  "Media",
  "People",
  "Events"
];

interface IProps {
  basePath: string;
  language: ILanguage;
  location: Location;
  history: History;
}

export default function LanguagePage(props: IProps) {
  const t = useContext(I18nContext);
  const { viewPrefs, updateViewPrefs } = useContext(ViewPrefsContext);
  const language = props.language;

  return (
    <div>
      <h2>
        {language.name}
        {"  "}
        <span className="subheader">{language.code}</span>
      </h2>
      <Route
        path={props.basePath + "/:domain?"}
        render={({ match, history }) => (
          <Tabs
            selectedIndex={selectedTab(
              match.params.domain,
              viewPrefs.dashboardTab as LanguagePageTab | undefined
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
                  location={props.location}
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

function selectedTab(
  urlDomain?: LanguagePageTab,
  viewPrefsDomain?: LanguagePageTab
) {
  let domain = urlDomain || viewPrefsDomain;
  const index = domain ? tabs.indexOf(domain) : -1;
  return index < 0 ? 0 : index;
}
