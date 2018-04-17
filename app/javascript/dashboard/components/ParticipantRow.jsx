import React from 'react'

class ParticipantRow extends React.PureComponent {
    render() {
        const participant = this.props.participant
        return (
            <tr>
                <td>
                    <a href={`/programs/${participant.programId}/`}>{participant.programName}</a>
                </td>
                <td>
                    <a href={`/participants/${participant.id}/`}>{participant.fullName}</a>
                </td>
                <td>
                    {participant.roles.join(', ')}
                </td>
            </tr>
        )
    }
}

export default ParticipantRow