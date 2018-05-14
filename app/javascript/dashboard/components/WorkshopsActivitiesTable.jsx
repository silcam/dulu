import React from 'react'
import WorkshopsActivityRow from './WorkshopsActivityRow'

class WorkshopsActivitiesTable extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            activities: []
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.programs == nextProps.programs) return null

        let activities = []
        for (let program of nextProps.programs)
            activities = activities.concat(program.linguistic_activities.workshops_activities)
         // TODO: sort & filter
         return {
             programs: nextProps.programs,
             activities: activities
         }
    }

    render() {
        const strings = this.props.strings
        return (
            <div>
                <h3> {strings.Workshops} </h3>
                {this.state.activities.length == 0 &&
                    <p>{strings.None}</p>
                }
                <table className='table'>
                    <tbody>
                        {this.state.activities.map((activity) => {
                            return <WorkshopsActivityRow key={activity.id}
                                                        activity={activity}
                                                        strings={strings} />
                        })}
                    </tbody>    
                </table>
            </div>
        )
    }
}

export default WorkshopsActivitiesTable