import React from "react";
import ResearchActivityRow from "./ResearchActivityRow";
import SortPicker from "./SortPicker";
import {
  languageSort,
  stageSort,
  lastUpdateSort
} from "../../util/sortFunctions";
import StyledTable from "../shared/StyledTable";

const sortFunctions = {
  language: languageSort,
  stage: stageSort,
  last_update: lastUpdateSort
};

function sortActivities(sort, activities) {
  activities.sort(sortFunctions[sort.option.toLowerCase()]);
  if (!sort.asc) activities.reverse();
  return activities;
}

class ResearchActivitiesTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sort: {
        option: "Language",
        asc: true
      },
      activities: []
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.programs == nextProps.programs) return null;

    let activities = [];
    for (let program of nextProps.programs)
      activities = activities.concat(
        program.linguistic_activities.research_activities
      );
    sortActivities(prevState.sort, activities);
    return {
      programs: nextProps.programs,
      activities: activities
    };
  }

  changeSort = sort => {
    let activities = sortActivities(sort, this.state.activities.slice());
    this.setState({
      activities: activities,
      sort: sort
    });
  };

  render() {
    const t = this.props.t;
    const sortOptions = ["Language", "Stage", "Last_update"];
    return (
      <div>
        <h3> {t("Research")} </h3>
        {this.state.activities.length == 0 ? (
          <p>{t("None")}</p>
        ) : (
          <SortPicker
            sort={this.state.sort}
            options={sortOptions}
            t={t}
            changeSort={this.changeSort}
          />
        )}
        <StyledTable>
          <tbody>
            {this.state.activities.map(activity => {
              return (
                <ResearchActivityRow
                  key={activity.id}
                  activity={activity}
                  t={t}
                />
              );
            })}
          </tbody>
        </StyledTable>
      </div>
    );
  }
}

export default ResearchActivitiesTable;
