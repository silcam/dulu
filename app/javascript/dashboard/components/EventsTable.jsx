import React from 'react'

import EventsTableSection from './EventsTableSection'
import FilterPicker from './FilterPicker'

class EventsTable extends React.PureComponent {
    constructor(props) {
        super(props)
        let filter = {}
        for (let domain of Object.values(props.strings.domains)) {
            filter[domain] = true
        }
        this.state = {
            programs: null,
            currentEvents: [],
            upcomingEvents: [],
            filter: filter
        }
    }

    static eventSort = (a, b) => {
        return a.startDate.localeCompare(b.startDate)
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

    updateFilter = (newFilter) => {
        console.log(newFilter)
        this.setState({
            filter: newFilter
        })
    }

    render() {
        if (this.state.currentEvents.length == 0 && this.state.upcomingEvents.length == 0) {
            return <p>{this.props.strings.No_events}</p>
        }
        return (
            <div>
                <FilterPicker strings={this.props.strings} filter={this.state.filter} updateFilter={this.updateFilter} />
                <table className='table'>
                    <tbody>
                        <EventsTableSection events={this.state.currentEvents} 
                                            sectionTitle={this.props.strings.Current_events}
                                            filter={this.state.filter}
                                            strings={this.props.strings} />
                        <EventsTableSection events={this.state.upcomingEvents}
                                            sectionTitle={this.props.strings.Upcoming_events}
                                            filter={this.state.filter}
                                            strings={this.props.strings} />
                    </tbody>
                </table>
            </div>
        )
    }
}

export default EventsTable