import React from "react";

import intCompare from "../../util/intCompare";

import SortPicker from "./SortPicker";
import TranslationActivityRow from "./TranslationActivityRow";
import { stageSort, lastUpdateSort } from "../../util/sortFunctions";
import StyledTable from "../shared/StyledTable";

const sortFunctions = {
  language: (a, b) => {
    if (a.language_name == b.language_name) {
      return intCompare(a.bible_book_id, b.bible_book_id);
    }
    return a.language_name.localeCompare(b.language_name);
  },
  book: (a, b) => {
    if (a.bible_book_id == b.bible_book_id)
      return a.language_name.localeCompare(b.language_name);
    return intCompare(a.bible_book_id, b.bible_book_id);
  },
  stage: stageSort,
  last_update: lastUpdateSort
};

function sortActivities(sort, activities) {
  activities.sort(sortFunctions[sort.option.toLowerCase()]);
  if (!sort.asc) activities.reverse();
  return activities;
}

class TranslationActivitiesTable extends React.PureComponent {
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
    // console.log('GetDerivedStateFromProps called...')
    if (prevState.languages !== nextProps.languages) {
      // console.log('Assembling and sorting activities...')
      let activities = [];
      for (let language of nextProps.languages) {
        activities = activities.concat(language.translation_activities);
      }
      sortActivities(prevState.sort, activities);
      return {
        languages: nextProps.languages,
        activities: activities
      };
    }
    return null;
  }

  changeSort = sort => {
    let activities = sortActivities(sort, this.state.activities.slice());
    this.setState({
      activities: activities,
      sort: sort
    });
  };

  render() {
    if (this.state.activities.length == 0)
      return <p>{this.props.t("No_translation_activities")}</p>;
    const sortOptions = ["Language", "Book", "Stage", "Last_update"];
    return (
      <div>
        <SortPicker
          sort={this.state.sort}
          options={sortOptions}
          t={this.props.t}
          changeSort={this.changeSort}
        />
        <StyledTable>
          <tbody>
            {this.state.activities.map(activity => {
              return (
                <TranslationActivityRow
                  key={activity.id}
                  activity={activity}
                  sort={this.state.sort}
                  t={this.props.t}
                />
              );
            })}
          </tbody>
        </StyledTable>
      </div>
    );
  }
}

export default TranslationActivitiesTable;
