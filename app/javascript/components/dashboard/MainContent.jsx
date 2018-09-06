import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import EventsTable from "./EventsTable";
import LinguisticsTable from "./LinguisticsTable";
import ParticipantsTable from "./ParticipantsTable";
import MediaTable from "./MediaTable";
import TranslationActivitiesTable from "./TranslationActivitiesTable";
import updateViewPrefs from "../../util/updateViewPrefs";

class MainContent extends React.PureComponent {
  constructor(props) {
    super(props);
    const tab = props.viewPrefs.dashboardTab || 0;
    this.state = {
      tab: tab
    };
  }

  selectTab = tab => {
    this.setState({
      tab: tab
    });
    updateViewPrefs({ dashboardTab: tab });
  };

  render() {
    const props = this.props;
    if (props.programs.length == 0) return <div />;
    return (
      <Tabs selectedIndex={this.state.tab} onSelect={this.selectTab}>
        <TabList>
          <Tab>{props.t('Bible_translation')}</Tab>
          <Tab>{props.t('Linguistics')}</Tab>
          <Tab>{props.t('Media')}</Tab>
          <Tab>{props.t('Participants')}</Tab>
          <Tab>{props.t('Events')}</Tab>
        </TabList>
        <TabPanel>
          <TranslationActivitiesTable
            programs={props.programs}
            t={props.t}
          />
        </TabPanel>
        <TabPanel>
          <LinguisticsTable programs={props.programs} t={props.t} />
        </TabPanel>
        <TabPanel>
          <MediaTable programs={props.programs} t={props.t} />
        </TabPanel>
        <TabPanel>
          <ParticipantsTable
            programs={props.programs}
            t={props.t}
          />
        </TabPanel>
        <TabPanel>
          <EventsTable programs={props.programs} t={props.t} />
        </TabPanel>
      </Tabs>
    );
  }
}

export default MainContent;
