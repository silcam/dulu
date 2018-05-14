import React from 'react'
import ResearchActivityRow from './ResearchActivityRow'

class ResearchActivitiesTable extends React.PureComponent {
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
            activities = activities.concat(program.linguistic_activities.research_activities)
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
                <h3> {strings.Research} </h3>
                {this.state.activities.length == 0 &&
                    <p>{strings.None}</p>
                }
                <table className='table'>
                    <tbody>
                        {this.state.activities.map((activity) => {
                            return <ResearchActivityRow key={activity.id}
                                                        activity={activity}
                                                        strings={strings} />
                        })}
                    </tbody>    
                </table>
            </div>
        )
    }
}

export default ResearchActivitiesTable