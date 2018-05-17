import React from 'react'

function WorkshopEventLink(props) {
    const workshop = props.workshop
    return (
        <a href={`/programs/${props.programId}/events/${workshop.event_id}`}
           className={props.className}>
            {workshop.name}
        </a>
    )
}

function CompletedText(props) {
    let count = 0
    for (let workshop of props.workshops) {
        if (workshop.completed) ++count
    }
    return `${count}/${props.workshops.length}`
}

class WorkshopsActivityRow extends React.PureComponent {
    render() {
        const activity = this.props.activity

        return (
            <tr>
                <td>
                    <a href={`/programs/${activity.program_id}`}>
                        {activity.program_name}
                    </a>
                </td>
                <td>
                    <a href={`/activities/${activity.id}`}>
                        {activity.title}
                    </a>
                </td>
                <td>
                    <CompletedText workshops={activity.workshops} />
                </td>
                <td className=''>
                    {activity.workshops.map((workshop, index) => {
                        const sep = ' - '
                        const style = {} // workshop.completed ? {fontStyle: 'italic'} : {}
                        const spanClass = workshop.completed ? 'text-muted' : ''
                        return (
                            <span key={workshop.id} style={style} className={spanClass}>
                                {workshop.event_id ? 
                                    <WorkshopEventLink workshop={workshop}
                                                       programId={activity.program_id}
                                                       className={spanClass} /> :
                                    workshop.name
                                }
                                {index < activity.workshops.length - 1 &&
                                    sep
                                }
                            </span>
                        )
                    })}
                </td>
                <td className='reallySmall rightCol'>
                    <i>
                        {activity.last_update.slice(0, 10)}
                    </i>
                </td>
            </tr>
        )
    }
}

export default WorkshopsActivityRow