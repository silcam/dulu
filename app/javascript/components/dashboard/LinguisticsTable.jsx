import React from "react";
import ResearchActivitiesTable from "./ResearchActivitiesTable";
import WorkshopsActivitiesTable from "./WorkshopsActivitiesTable";

class LinguisticsTable extends React.PureComponent {
  render() {
    return (
      <div>
        <ResearchActivitiesTable
          t={this.props.t}
          languages={this.props.languages}
        />

        <WorkshopsActivitiesTable
          t={this.props.t}
          languages={this.props.languages}
        />
      </div>
    );
  }
}

export default LinguisticsTable;
