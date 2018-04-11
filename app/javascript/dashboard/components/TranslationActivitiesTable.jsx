import axios from 'axios'
import React from 'react'

import TranslationActivityRow from './TranslationActivityRow'

class TranslationActivitiesTable extends React.PureComponent {
    constructor(props) {
        super(props)
        // this.state = {
        //     activities: []
        // }
    }

    // componentDidMount() {
    //     axios.get(`/api/programs/${this.props.programId}/translation_activities`)
    //     .then(response => {
    //         this.setState({
    //             activities: response.data.activities
    //         })
    //     })
    //     .catch(error => console.error(error))
    // }

    render() {
        return (
            <table className="table">
                <tbody>
                    {this.props.programs.map((program) => {
                        return (
                            <React.Fragment key={program.id}>
                                {program.translation_activities.map((activity) => {
                                    return <TranslationActivityRow key={activity.id} activity={activity} program={program}
                                            oneProgram={this.props.programs.length==1} />
                                })}
                            </React.Fragment>
                        )
                    })}
                </tbody>
            </table>
        )
    }
}

export default TranslationActivitiesTable