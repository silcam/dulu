import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Selection } from "./Dashboard";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import I18nContext from "../../contexts/I18nContext";
import DBEventsContainer from "./DBEventsContainer";
import useViewPrefs from "../../reducers/useViewPrefs";
import useDashboardLanguages from "./useDashboardLanguages";
import DBActivitiesTable from "./DBActivitiesTable";
import DBParticipantsTable from "./DBParticipantsTable";

interface IProps {
  selection: Selection;
}

const tabs = ["Translation", "Linguistics", "Media", "People", "Events"];

export default function MainContent(props: IProps) {
  const t = useContext(I18nContext);
  const { viewPrefs, setViewPrefs } = useViewPrefs();
  const { languageIds, selectedName } = useDashboardLanguages(props.selection);

  return (
    <div>
      {selectedName && (
        <h3>
          <Link to={`/${props.selection.type}s/${props.selection.id!}`}>
            {selectedName}
          </Link>
        </h3>
      )}
      {languageIds.length > 0 && (
        <Tabs
          selectedIndex={tabIndex(viewPrefs.dashboardTab)}
          onSelect={index => setViewPrefs({ dashboardTab: tabs[index] })}
        >
          <TabList>
            {tabs.map(name => (
              <Tab key={name}>{t(name)}</Tab>
            ))}
          </TabList>
          <TabPanel>
            <DBActivitiesTable
              languageIds={languageIds}
              sortOptions={["Language", "Book", "Stage"]}
              type="Translation"
            />
          </TabPanel>
          <TabPanel>
            <h4>{t("Research_activities")}</h4>
            <DBActivitiesTable languageIds={languageIds} type="Research" />
            <h4>{t("Workshops_activities")}</h4>
            <DBActivitiesTable
              languageIds={languageIds}
              type="Workshops"
              sortOptions={["Language"]}
              noAPILoad
            />
          </TabPanel>

          <TabPanel>
            <DBActivitiesTable
              languageIds={languageIds}
              sortOptions={["Language", "Media", "Stage"]}
              type="Media"
            />
          </TabPanel>

          <TabPanel>
            <DBParticipantsTable languageIds={languageIds} />
          </TabPanel>

          <TabPanel>
            <DBEventsContainer languageIds={languageIds} />
          </TabPanel>
        </Tabs>
      )}
    </div>
  );
}

function tabIndex(viewPrefTab?: string) {
  if (!viewPrefTab) return 0;
  return Math.max(0, tabs.indexOf(viewPrefTab));
}
