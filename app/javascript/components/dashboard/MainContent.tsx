import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Selection } from "./Dashboard";
import DBActivitiesContainer from "./DBActivitiesContainer";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import I18nContext from "../../application/I18nContext";
import { ViewPrefs, UpdateViewPrefs } from "../../application/DuluApp";
import DBEventsContainer from "./DBEventsContainer";
import DBParticipantsContainer from "./DBParticipantsContainer";

interface IProps {
  languageIds: number[];
  selectedName?: string;
  selection: Selection;
  viewPrefs: ViewPrefs;
  updateViewPrefs: UpdateViewPrefs;
}

const tabs = ["Translation", "Linguistics", "Media", "People", "Events"];

export default function MainContent(props: IProps) {
  const t = useContext(I18nContext);

  return (
    <div>
      {props.selectedName && (
        <h3>
          <Link to={`/${props.selection.type}s/${props.selection.id!}`}>
            {props.selectedName}
          </Link>
        </h3>
      )}
      {props.languageIds.length > 0 && (
        <Tabs
          selectedIndex={tabIndex(props.viewPrefs.dashboardTab)}
          onSelect={index =>
            props.updateViewPrefs({ dashboardTab: tabs[index] })
          }
        >
          <TabList>
            {tabs.map(name => (
              <Tab key={name}>{t(name)}</Tab>
            ))}
          </TabList>
          <TabPanel>
            <DBActivitiesContainer
              languageIds={props.languageIds}
              sortOptions={["Language", "Book", "Stage"]}
              type="Translation"
            />
          </TabPanel>
          <TabPanel>
            <h4>{t("Research_activities")}</h4>
            <DBActivitiesContainer
              languageIds={props.languageIds}
              type="Research"
            />
            <h4>{t("Workshops_activities")}</h4>
            <DBActivitiesContainer
              languageIds={props.languageIds}
              type="Workshops"
              sortOptions={["Language"]}
              noAPILoad
            />
          </TabPanel>

          <TabPanel>
            <DBActivitiesContainer
              languageIds={props.languageIds}
              sortOptions={["Language", "Media", "Stage"]}
              type="Media"
            />
          </TabPanel>

          <TabPanel>
            <DBParticipantsContainer languageIds={props.languageIds} />
          </TabPanel>

          <TabPanel>
            <DBEventsContainer languageIds={props.languageIds} />
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
