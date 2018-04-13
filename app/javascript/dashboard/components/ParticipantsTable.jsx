import React from 'react'

import ParticipantRow from './ParticipantRow'

class ParticipantsTable extends React.PureComponent {

    render() {
        return (
            <table className="table">
                <tbody>
                    {this.props.programs.map((program) => {
                        return (
                            <React.Fragment key={program.id}>
                                {program.participants.map((participant) => {
                                    return <ParticipantRow key={participant.id}
                                                        participant={participant}
                                                        program={program}
                                                        oneProgram={this.props.programs.length==1}/>
                                })}
                            </React.Fragment>
                        )
                    })}
                </tbody>
            </table>
        )
    }
}

export default ParticipantsTable