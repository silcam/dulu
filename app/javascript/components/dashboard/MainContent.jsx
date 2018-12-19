import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import PropTypes from "prop-types";
import EventsTable from "./EventsTable";
import LinguisticsTable from "./LinguisticsTable";
import ParticipantsTable from "./ParticipantsTable";
import MediaTable from "./MediaTable";
import TranslationActivitiesTable from "./TranslationActivitiesTable";

const tabs = ["Translation", "Linguistics", "Media", "Participants", "Events"];

export default class MainContent extends React.PureComponent {
  constructor(props) {
    super(props);
    const tabIndex = tabs.indexOf(props.viewPrefs.dashboardTab);
    this.state = {
      tab: tabIndex >= 0 ? tabIndex : 0
    };
  }

  selectTab = tabIndex => {
    this.setState({
      tab: tabIndex
    });
    this.props.updateViewPrefs({ dashboardTab: tabs[tabIndex] });
  };

  render() {
    const props = this.props;
    if (props.programs.length == 0) return <div />;
    return (
      <Tabs selectedIndex={this.state.tab} onSelect={this.selectTab}>
        <TabList>
          {tabs.map(tab => (
            <Tab key={tab}>{props.t(tab)}</Tab>
          ))}
        </TabList>
        <TabPanel>
          <TranslationActivitiesTable programs={props.programs} t={props.t} />
        </TabPanel>
        <TabPanel>
          <LinguisticsTable programs={props.programs} t={props.t} />
        </TabPanel>
        <TabPanel>
          <MediaTable programs={props.programs} t={props.t} />
        </TabPanel>
        <TabPanel>
          <ParticipantsTable programs={props.programs} t={props.t} />
        </TabPanel>
        <TabPanel>
          <EventsTable programs={props.programs} t={props.t} />
        </TabPanel>
      </Tabs>
    );
  }
}

MainContent.propTypes = {
  t: PropTypes.func.isRequired,
  viewPrefs: PropTypes.object.isRequired,
  updateViewPrefs: PropTypes.func.isRequired
};
