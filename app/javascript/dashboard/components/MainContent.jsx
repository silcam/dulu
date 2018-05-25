import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import EventsTable from './EventsTable'
import LinguisticsTable from './LinguisticsTable'
import ParticipantsTable from './ParticipantsTable'
import MediaTable from './MediaTable'
import TranslationActivitiesTable from './TranslationActivitiesTable'
import updateViewPrefs from '../../util/updateViewPrefs'

class MainContent extends React.PureComponent {
    constructor(props) {
        super(props)
        const tab = props.viewPrefs.dashboardTab || 0
        this.state = {
            tab: tab
        }
    }

    selectTab = (tab) => {
        this.setState({
            tab: tab
        })
        updateViewPrefs({dashboardTab: tab})
    }

    render() {
        const props = this.props
        if (props.programs.length == 0) return <div></div>
        return (
            <Tabs selectedIndex={this.state.tab} onSelect={this.selectTab}>
                <TabList>
                    <Tab>{props.strings.Bible_translation}</Tab>
                    <Tab>{props.strings.Linguistics}</Tab>
                    <Tab>{props.strings.Media}</Tab>
                    <Tab>{props.strings.Participants}</Tab>
                    <Tab>{props.strings.Events}</Tab>
                </TabList>
                <TabPanel>
                    <TranslationActivitiesTable programs={props.programs} strings={props.strings} />
                </TabPanel>
                <TabPanel>
                    <LinguisticsTable programs={props.programs} strings={props.strings} />
                </TabPanel>
                <TabPanel>
                    <MediaTable programs={props.programs} strings={props.strings} />
                </TabPanel>
                <TabPanel>
                    <ParticipantsTable programs={props.programs} strings={props.strings} />
                </TabPanel>
                <TabPanel>
                    <EventsTable programs={props.programs} strings={props.strings} />
                </TabPanel>
            </Tabs>
        )
    }
}

export default MainContent