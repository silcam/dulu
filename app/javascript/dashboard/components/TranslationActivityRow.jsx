import React from 'react'

class TranslationActivityRow extends React.PureComponent {

    render() {
        const activity = this.props.activity
        const program = this.props.program
        return (
            <tr>
                {!this.props.oneProgram && 
                    <td>
                        <a href={`/programs/${program.id}/`}>{program.name}</a>
                    </td>
                }
                <td>
                    <a href={`/activities/${activity.id}/`}>{activity.name}</a>
                </td>
                <td className="progress-cell">
                    <div className="progress">
                        <div className="progress-bar" role="progressbar"
                            style={{width: `${activity.progress.percent}%`, backgroundColor: activity.progress.color}}>
                        </div>
                    </div>
                </td>
                <td>
                    {activity.stageName}
                </td>
            </tr>
        )
    }
}

export default TranslationActivityRow