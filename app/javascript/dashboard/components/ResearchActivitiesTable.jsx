import React from 'react'
import ResearchActivityRow from './ResearchActivityRow'
import SortPicker from './SortPicker'
import { languageSort, stageSort, lastUpdateSort } from '../../util/sortFunctions'

const sortFunctions = {
    language: languageSort,
    stage: stageSort,
    last_update: lastUpdateSort
}

function sortActivities(sort, activities) {
    activities.sort(sortFunctions[sort.option.toLowerCase()])
    if (!sort.asc) activities.reverse()
    return activities
}

class ResearchActivitiesTable extends React.PureComponent {
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
            activities = activities.concat(program.linguistic_activities.research_activities)
        sortActivities(prevState.sort, activities)
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
        const sortOptions = ['Language', 'Stage', 'Last_update']
        return (
            <div>
                <h3> {strings.Research} </h3>
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
                            return <ResearchActivityRow key={activity.id}
                                                        activity={activity}
                                                        strings={strings} />
                        })}
                    </tbody>    
                </table>
            </div>
        )
    }
}

export default ResearchActivitiesTable