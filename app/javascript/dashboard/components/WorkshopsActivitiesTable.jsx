import React from 'react'
import WorkshopsActivityRow from './WorkshopsActivityRow'
import SortPicker from './SortPicker';

const sortFunctions = {
    language: (a, b) => {
        return a.program_name.localeCompare(b.program_name)
    },
    last_update: (a, b) => {
        return a.last_update.localeCompare(b.last_update)
    }
}

function sortActivities(sort, activities) {
    activities.sort(sortFunctions[sort.option.toLowerCase()])
    if (!sort.asc) activities.reverse()
    return activities
}

class WorkshopsActivitiesTable extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            sort: {
                option: 'Language',
                asc: true
            },
            activities: []
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.programs == nextProps.programs) return null

        let activities = []
        for (let program of nextProps.programs)
            activities = activities.concat(program.linguistic_activities.workshops_activities)
         // TODO: sort & filter
         return {
             programs: nextProps.programs,
             activities: activities
         }
    }

    changeSort = (sort) => {
        let activities = sortActivities(sort, this.state.activities.slice())
        this.setState({
            activities: activities,
            sort: sort
        })
    }

    render() {
        const strings = this.props.strings
        const sortOptions = ['Language', 'Last_update']
        return (
            <div>
                <h3> {strings.Workshops} </h3>
                {this.state.activities.length == 0 ?
                    <p>{strings.None}</p> :
                    <SortPicker sort={this.state.sort}
                                options={sortOptions}
                                strings={strings}
                                changeSort={this.changeSort} />
                }
                <table className='table'>
                    <tbody>
                        {this.state.activities.map((activity) => {
                            return <WorkshopsActivityRow key={activity.id}
                                                        activity={activity}
                                                        strings={strings} />
                        })}
                    </tbody>    
                </table>
            </div>
        )
    }
}

export default WorkshopsActivitiesTable