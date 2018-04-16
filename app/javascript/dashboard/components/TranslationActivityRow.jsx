import React from 'react'

class TranslationActivityRow extends React.PureComponent {

    render() {
        const activity = this.props.activity
        return (
            <tr>
                {!this.props.oneProgram && 
                    <td>
                        <a href={`/programs/${activity.programId}/`}>{activity.programName}</a>
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
                <td className='reallySmall'>
                    <i>
                        {this.props.strings.Updated}: {activity.lastUpdate.slice(0, 10)}
                    </i>
                </td>
            </tr>
        )
    }
}

export default TranslationActivityRow