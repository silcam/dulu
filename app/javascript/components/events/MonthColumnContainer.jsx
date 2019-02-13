import { connect } from "react-redux";
import Event from "../../models/Event";
import MonthColumn from "./MonthColumn";

const mapStateToProps = (state, ownProps) => {
  const periodEvent = Event.comparisonEvent({
    start: ownProps.month,
    end: ownProps.month
  });
  return {
    events: Object.values(state.events.byId)
      .filter(e => Event.overlapCompare(e, periodEvent) == 0)
      .sort(Event.compare),
    people: state.people.byId,
    languages: state.languages.byId,
    clusters: state.clusters.byId
  };
};

const MonthContainerColumn = connect(mapStateToProps)(MonthColumn);

export default MonthContainerColumn;
