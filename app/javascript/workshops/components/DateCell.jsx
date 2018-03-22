import React from 'react'

/*
    Required props:
        string date
        string eventPath
        string newEventPath
        boolean canUpdate
*/

function dateText(date, eventPath) {
    return(
        eventPath ?
            <a href={eventPath}>{date}</a> :
            date
    )
}

function addEventLink(eventPath, canUpdate, newEventText, newEventPath) {
    return(
        canUpdate && !eventPath ?
            <a href={newEventPath}>{newEventText}</a> :
            ''
    )
}

function DateCell(props) {
    const theDateText = dateText(props.date, props.eventPath)
    const theAddEventLink = addEventLink(props.eventPath, 
                                         props.canUpdate, 
                                         props.strings.Add_event,
                                         props.newEventPath)
    return(
        <div>
            {theDateText}
            {(theDateText && theAddEventLink) && <br />}
            {theAddEventLink}
        </div>
    )
}

export default DateCell