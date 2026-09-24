import React, { useContext } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import LanguagePageContent from "./LanguagePageContent";
import { useNavigate, useParams } from "react-router-dom";
import I18nContext from "../../contexts/I18nContext";
import { ILanguage } from "../../models/Language";
import NotesView from "../notes/NotesView";
import { loadAction } from "../../reducers/LoadAction";
import { useDispatch } from "react-redux";
import useViewPrefs from "../../reducers/useViewPrefs";
import { useLanguageContext } from "./LanguagePageRouter";

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

// Rendered both by the :domain? route (see LanguagePageRoute below) and, with
// no basePath, directly by the Dashboard when a language is selected there --
// which is why the tab click only navigates when there is a basePath.
interface IProps {
  basePath: string;
  language: ILanguage;
}

export default function LanguagePage(props: IProps) {
  const t = useContext(I18nContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { domain } = useParams();
  const { viewPrefs, setViewPrefs } = useViewPrefs();
  const language = props.language;

  return (
    <div>
      <h2>
        {language.name}
        {"  "}
        <span className="subheader">{language.code}</span>
      </h2>
      <NotesView
        notes={language.notes}
        setNotes={notes =>
          dispatch(loadAction({ languages: [{ ...language, notes }] }))
        }
        noteFor={{ for_type: "Language", for_id: language.id }}
      />
      <Tabs
        selectedIndex={selectedTab(
          domain as LanguagePageTab | undefined,
          viewPrefs.dashboardTab as LanguagePageTab | undefined
        )}
        onSelect={index => {
          setViewPrefs({ dashboardTab: tabs[index] });
          if (props.basePath) navigate(`${props.basePath}/${tabs[index]}`);
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
            <LanguagePageContent language={language} tab={name} />
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
}

function selectedTab(
  urlDomain?: LanguagePageTab,
  viewPrefsDomain?: LanguagePageTab
) {
  const domain = urlDomain || viewPrefsDomain;
  const index = domain ? tabs.indexOf(domain) : -1;
  return index < 0 ? 0 : index;
}

// The route element: LanguagePage's data comes from the layout route above it.
export function LanguagePageRoute() {
  const { language, basePath } = useLanguageContext();

  return <LanguagePage language={language} basePath={basePath} />;
}
