import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import ParticipantsTable from './ParticipantsTable';
import TranslationActivitiesTable from './TranslationActivitiesTable'

function MainContent(props) {
    return (
        <Tabs defaultIndex={0}>
            <TabList>
                <Tab>{props.strings.Translation_activities}</Tab>
                <Tab>{props.strings.Participants}</Tab>
            </TabList>
            <TabPanel>
                <TranslationActivitiesTable programs={props.programs} strings={props.strings} />
            </TabPanel>
            <TabPanel>
                <ParticipantsTable programs={props.programs} strings={props.strings} />
            </TabPanel>
        </Tabs>
    )
}

export default MainContent