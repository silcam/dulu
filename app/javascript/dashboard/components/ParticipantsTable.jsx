import React from 'react'

import ParticipantRow from './ParticipantRow'
import SortPicker from './SortPicker'

class ParticipantsTable extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            sort: 'Language',
            participants: []
        }
    }

    static sortFunctions = {
        language: (a, b) => {
            return a.programName.localeCompare(b.programName)
        },
        person: (a, b) => {
            const comparison = a.fullNameRev.localeCompare(b.fullNameRev)
            if (comparison == 0) return ParticipantsTable.sortFunctions.language(a, b)
            return comparison
        },
        role: (a, b) => {
            if (a.roles.length == 0 && b.roles.length > 0) return 1
            if (b.roles.length == 0 && a.roles.length > 0) return -1
            const comparison = a.roles.join().localeCompare(b.roles.join())
            if (comparison == 0) return ParticipantsTable.sortFunctions.person(a, b)
            return comparison
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.programs != nextProps.programs) {
            let participants = []
            for (let program of nextProps.programs) {
                participants = participants.concat(program.participants)
            }
            participants.sort(ParticipantsTable.sortFunctions[prevState.sort.toLowerCase()])
            return {
                programs: nextProps.programs,
                participants: participants
            }
        }
        return null
    }

    changeSort = (sort) => {
        let participants = this.state.participants.slice()
        participants.sort(ParticipantsTable.sortFunctions[sort.toLowerCase()])
        this.setState({
            participants: participants,
            sort: sort
        })
    }

    render() {
        if (this.state.participants.length == 0) return <p>{this.props.strings.No_participants}</p>
        const sortOptions = ['Language', 'Person', 'Role']
        return (
            <div>
                <SortPicker sort={this.state.sort} options={sortOptions}
                            strings={this.props.strings} changeSort={this.changeSort} />
                <table className="table">
                    <tbody>
                        {this.state.participants.map((participant) => {
                            return <ParticipantRow key={`${participant.programId}-${participant.id}`}
                                                    participant={participant}/>
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default ParticipantsTable