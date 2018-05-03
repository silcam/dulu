import React from 'react'

import EventRows from './EventRows'

class EventsTable extends React.PureComponent {
    render() {
        const person = this.props.person
        const strings = this.props.strings

        if (person.events.current.length == 0 &&
            person.events.past.length == 0 &&
            person.events.upcoming.length == 0) {
                return null
        }

        return (
            <div>
                <h3>
                    {strings.Events}
                </h3>
                <table className='table auto-width'>
                    <tbody>
                        <EventRows events={person.events.upcoming}
                                   strings={strings} />
                        <EventRows events={person.events.current}
                                   strings={strings} />
                        <EventRows events={person.events.past}
                                   pastEvents={true}
                                   strings={strings} />
                    </tbody>
                </table>
            </div>
        )
    }
}

export default EventsTable