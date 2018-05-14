import React from 'react'
import ResearchActivitiesTable from './ResearchActivitiesTable'
import WorkshopsActivitiesTable from './WorkshopsActivitiesTable'

class LinguisticsTable extends React.PureComponent {
    render() {
        return (
            <div>
                <ResearchActivitiesTable strings={this.props.strings}
                                         programs={this.props.programs} />

                <WorkshopsActivitiesTable strings={this.props.strings}
                                          programs={this.props.programs} />
            </div>
        )
    }
}

export default LinguisticsTable