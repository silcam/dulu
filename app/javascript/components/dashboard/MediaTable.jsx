import React from "react";
import {
  sortActivities,
  languageSort,
  stageSort,
  lastUpdateSort,
  nameSort
} from "../../util/sortFunctions";
import MediaActivityRow from "./MediaActivityRow";
import SortPicker from "./SortPicker";
import StyledTable from "../shared/StyledTable";

const sortFunctions = {
  language: languageSort,
  media: nameSort,
  stage: stageSort,
  last_update: lastUpdateSort
};

class MediaTable extends React.PureComponent {
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
    if (prevState.programs !== nextProps.programs) {
      let activities = [];
      for (let program of nextProps.programs) {
        activities = activities.concat(program.media_activities);
      }
      sortActivities(prevState.sort, activities, sortFunctions);
      return {
        programs: nextProps.programs,
        activities: activities
      };
    }
    return null;
  }

  changeSort = sort => {
    let activities = sortActivities(
      sort,
      this.state.activities.slice(),
      sortFunctions
    );
    this.setState({
      activities: activities,
      sort: sort
    });
  };

  render() {
    const t = this.props.t;
    const sortOptions = ["Language", "Media", "Stage", "Last_update"];

    if (this.state.activities.length == 0)
      return <p>{t("No_media_activities")}</p>;

    return (
      <div>
        <SortPicker
          sort={this.state.sort}
          options={sortOptions}
          t={t}
          changeSort={this.changeSort}
        />
        <StyledTable>
          <tbody>
            {this.state.activities.map(activity => {
              return (
                <MediaActivityRow key={activity.id} activity={activity} t={t} />
              );
            })}
          </tbody>
        </StyledTable>
      </div>
    );
  }
}

export default MediaTable;