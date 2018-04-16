import axios from 'axios'
import React from 'react'

import intCompare from '../../util/intCompare'

import SortPicker from './SortPicker'
import TranslationActivityRow from './TranslationActivityRow'

class TranslationActivitiesTable extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            sort: 'Language',
            activities: []
        }
    }

    static sortFunctions = {
        language: (a, b) => {
            if (a.programId == b.programId) {
                return intCompare(a.bibleBookId, b.bibleBookId)
            }
            return intCompare(a.programId, b.programId)
        },
        book: (a, b) => {
            if (a.bibleBookId == b.bibleBookId) return intCompare(a.programId, b.programId)
            return intCompare(a.bibleBookId, b.bibleBookId)
        },
        stage: (a, b) => {
            return intCompare(a.progress.percent, b.progress.percent)
        },
        last_update: (a, b) => {
            return a.lastUpdate.localeCompare(b.lastUpdate)
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
            activities.sort(TranslationActivitiesTable.sortFunctions[prevState.sort.toLowerCase()])
            return {
                programs: nextProps.programs,
                activities: activities
            }
        }
        return null;
    }

    changeSort = (e) => {
        let activities = this.state.activities.slice()
        const sort = e.target.value
        activities.sort(TranslationActivitiesTable.sortFunctions[sort.toLowerCase()])
        this.setState({
            activities: activities,
            sort: e.target.value
        })
    }

    render() {
        return (
            <div>
                <SortPicker sort={this.state.sort} strings={this.props.strings} changeSort={this.changeSort} />
                <table className="table">
                    <tbody>
                        {this.state.activities.map((activity) => {
                            return <TranslationActivityRow key={activity.id} activity={activity}
                                    oneProgram={this.props.programs.length==1} sort={this.state.sort}
                                    strings={this.props.strings} />

                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default TranslationActivitiesTable