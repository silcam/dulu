import { AppState } from "../../reducers/appReducer";
import Language from "../../models/Language";
import { addActivities } from "../../actions/activityActions";
import { connect } from "react-redux";
import DBActivitiesTable from "./DBActivitiesTable";
import { ActivityType } from "../../models/Activity";

interface IProps {
  languageIds: number[];
  type: ActivityType;
}

const mapStateToProps = (state: AppState, ownProps: IProps) => ({
  activities: ownProps.languageIds
    .map(id => Language.activities(state, id, ownProps.type))
    .flat(),
  languages: state.languages.byId
});

const mapDispatchToProps = {
  addActivities
};

const DBActivitiesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DBActivitiesTable);

export default DBActivitiesContainer;
