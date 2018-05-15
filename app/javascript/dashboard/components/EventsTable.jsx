import React from 'react'

import EventsFilterer from './EventsFilterer'
import EventsTableSection from './EventsTableSection'

class EventsTable extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            programs: null,
            currentEvents: [],
            upcomingEvents: [],
            domainFilter: 'All'
        }
    }

    static eventSort = (a, b) => {
        return a.start_date.localeCompare(b.start_date)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.programs == prevState.programs) return null
        let currentEvents = []
        let upcomingEvents = []
        for (const program of nextProps.programs) {
            currentEvents = currentEvents.concat(program.events.current)
            upcomingEvents = upcomingEvents.concat(program.events.upcoming)
        }
        currentEvents.sort(EventsTable.eventSort)
        upcomingEvents.sort(EventsTable.eventSort)
        return {
            programs: nextProps.programs,
            currentEvents: currentEvents,
            upcomingEvents: upcomingEvents
        }
    }

    setDomainFilter = (newFilter) => {
        this.setState({
            domainFilter: newFilter
        })
    }

    render() {
        if (this.state.currentEvents.length == 0 && this.state.upcomingEvents.length == 0) {
            return <p>{this.props.strings.No_events}</p>
        }
        return (
            <div>
                <EventsFilterer strings={this.props.strings} 
                                domainFilter={this.state.domainFilter} 
                                setDomainFilter={this.setDomainFilter} />
                <table className='table'>
                    <tbody>
                        <EventsTableSection events={this.state.currentEvents} 
                                            sectionTitle={this.props.strings.Current_events}
                                            domainFilter={this.state.domainFilter}
                                            strings={this.props.strings} />
                        <EventsTableSection events={this.state.upcomingEvents}
                                            sectionTitle={this.props.strings.Upcoming_events}
                                            domainFilter={this.state.domainFilter}
                                            strings={this.props.strings} />
                    </tbody>
                </table>
            </div>
        )
    }
}

export default EventsTable