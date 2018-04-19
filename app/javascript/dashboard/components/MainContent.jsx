import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import EventsTable from './EventsTable'
import ParticipantsTable from './ParticipantsTable';
import TranslationActivitiesTable from './TranslationActivitiesTable'

class MainContent extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            tab: 0
        }
    }

    selectTab = (tab) => {
        this.setState({
            tab: tab
        })
    }

    render() {
        const props = this.props
        if (props.programs.length == 0) return <div></div>
        return (
            <Tabs selectedIndex={this.state.tab} onSelect={this.selectTab}>
                <TabList>
                    <Tab>{props.strings.Bible_translation}</Tab>
                    <Tab>{props.strings.Participants}</Tab>
                    <Tab>{props.strings.Events}</Tab>
                </TabList>
                <TabPanel>
                    <TranslationActivitiesTable programs={props.programs} strings={props.strings} />
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