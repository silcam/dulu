import React from 'react'

class TranslationActivityRow extends React.PureComponent {

    render() {
        const activity = this.props.activity
        return (
            <tr>
                {!this.props.oneProgram && 
                    <td>{this.props.program.name}</td>
                }
                <td>
                    {activity.name}
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