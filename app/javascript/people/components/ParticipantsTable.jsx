import React from 'react'

class ParticipantsTable extends React.PureComponent {
    render() {
        const strings = this.props.strings
        const person = this.props.person

        if (person.participants.length == 0) return null

        return (
            <div>
                <h3>
                    {strings.Language_programs}
                </h3>
                <table className='table'>
                    <tbody>
                        {person.participants.map((participant) => {
                            const clusterProgramPath = participant.program_id ?
                                                        `/programs/${participant.program_id}` :
                                                        `/clusters/${participant.cluster_id}`
                            return (
                                <tr key={participant.id}>
                                    <td>
                                        <a href={clusterProgramPath}>
                                            {participant.name}
                                        </a>
                                    </td>
                                    <td className='subtle-links'>
                                        <a href={`/participants/${participant.id}`}>
                                            {participant.roles.join(', ')}
                                        </a>
                                    </td>
                                </tr>                                    
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default ParticipantsTable