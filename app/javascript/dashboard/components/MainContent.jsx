import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import EventsTable from './EventsTable'
import ParticipantsTable from './ParticipantsTable';
import TranslationActivitiesTable from './TranslationActivitiesTable'

function MainContent(props) {
    if (props.programs.length == 0) return <div></div>
    return (
        <Tabs defaultIndex={0}>
            <TabList>
                <Tab>{props.strings.Translation_activities}</Tab>
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

export default MainContent