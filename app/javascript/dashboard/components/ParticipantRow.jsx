import React from 'react'

class ParticipantRow extends React.PureComponent {
    render() {
        const participant = this.props.participant
        const program = this.props.program
        return (
            <tr>
                {!this.props.oneProgram && 
                    <td>
                        <a href={`/programs/${program.id}/`}>{program.name}</a>
                    </td>
                }
                <td>
                    <a href={`/participants/${participant.id}/`}>{participant.full_name}</a>
                </td>
                <td>
                    {participant.roles.join(', ')}
                </td>
            </tr>
        )
    }
}

export default ParticipantRow