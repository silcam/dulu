import React from 'react'

import intCompare from '../../util/intCompare'

import SortPicker from './SortPicker'
import TranslationActivityRow from './TranslationActivityRow'

const sortFunctions = {
    language: (a, b) => {
        if (a.programName == b.programName) {
            return intCompare(a.bibleBookId, b.bibleBookId)
        }
        return a.programName.localeCompare(b.programName)
    },
    book: (a, b) => {
        if (a.bibleBookId == b.bibleBookId) return a.programName.localeCompare(b.programName)
        return intCompare(a.bibleBookId, b.bibleBookId)
    },
    stage: (a, b) => {
        return intCompare(a.progress.percent, b.progress.percent)
    },
    last_update: (a, b) => {
        return a.lastUpdate.localeCompare(b.lastUpdate)
    }
}

function sortActivities(sort, activities) {
    activities.sort(sortFunctions[sort.option.toLowerCase()])
    if (!sort.asc) activities.reverse()
    return activities
}

class TranslationActivitiesTable extends React.PureComponent {
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
        // console.log('GetDerivedStateFromProps called...')
        if (prevState.programs !== nextProps.programs) {
            // console.log('Assembling and sorting activities...')
            let activities = []
            for (let program of nextProps.programs) {
                activities = activities.concat(program.translation_activities)
            }
            sortActivities(prevState.sort, activities)
            return {
                programs: nextProps.programs,
                activities: activities
            }
        }
        return null
    }

    changeSort = (sort) => {
        let activities = sortActivities(sort, this.state.activities.slice())
        this.setState({
            activities: activities,
            sort: sort
        })
    }

    render() {
        if (this.state.activities.length == 0) return <p>{this.props.strings.No_translation_activities}</p>
        const sortOptions = ['Language', 'Book', 'Stage', 'Last_update']
        return (
            <div>
                <SortPicker sort={this.state.sort} options={sortOptions} 
                            strings={this.props.strings} changeSort={this.changeSort} />
                <table className="table">
                    <tbody>
                        {this.state.activities.map((activity) => {
                            return <TranslationActivityRow key={activity.id} activity={activity}
                                        sort={this.state.sort} strings={this.props.strings} />

                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default TranslationActivitiesTable