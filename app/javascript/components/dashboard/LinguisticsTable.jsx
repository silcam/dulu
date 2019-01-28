import React from "react";
import ResearchActivitiesTable from "./ResearchActivitiesTable";
import WorkshopsActivitiesTable from "./WorkshopsActivitiesTable";

class LinguisticsTable extends React.PureComponent {
  render() {
    return (
      <div>
        <ResearchActivitiesTable
          t={this.props.t}
          programs={this.props.programs}
        />

        <WorkshopsActivitiesTable
          t={this.props.t}
          programs={this.props.programs}
        />
      </div>
    );
  }
}

export default LinguisticsTable;
