import { connect } from "react-redux";
import Event from "../../models/Event";
import MonthColumn from "./MonthColumn";
import { AppState } from "../../reducers/appReducer";
import { IMonth } from "./dateUtils";

interface IProps {
  month: IMonth;
}

const mapStateToProps = (state: AppState, ownProps: IProps) => {
  const periodEvent = Event.comparisonEvent({
    start: ownProps.month,
    end: ownProps.month
  });
  return {
    events: state.events.list.filter(
      e => Event.overlapCompare(e, periodEvent) == 0
    ),
    people: state.people,
    languages: state.languages,
    clusters: state.clusters
  };
};

const MonthContainerColumn = connect(mapStateToProps)(MonthColumn);

export default MonthContainerColumn;
