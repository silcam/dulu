import React from 'react'

import ParticipantsTable from './ParticipantsTable';
import TranslationActivitiesTable from './TranslationActivitiesTable'

function MainContent(props) {
    const mainContentTables = {
        TranslationActivities: <TranslationActivitiesTable programs={props.programs} />,
        Participants: <ParticipantsTable programs={props.programs} />
    }
    return mainContentTables[props.mainContentSelection]
}

export default MainContent