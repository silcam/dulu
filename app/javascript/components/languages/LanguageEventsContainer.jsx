import { connect } from "react-redux";
import * as eventActionCreators from "../../actions/eventActions";
import { addPeople } from "../../actions/peopleActions";
import { addLanguages } from "../../actions/languageActions";
import { addClusters } from "../../actions/clusterActions";
import { setEventsCan } from "../../actions/canActions";
import Event from "../../models/Event";
import LanguageEventsTable from "./LanguageEventsTable";

const mapStateToProps = (state, ownProps) => {
  return {
    events: Object.values(state.events.byId)
      .filter(
        event =>
          (event.language_ids.includes(ownProps.language.id) ||
            event.cluster_ids.includes(ownProps.language.cluster_id)) &&
          (!ownProps.domain || ownProps.domain == event.domain)
      )
      .sort(Event.revCompare),
    eventsBackTo:
      state.events.backTo[Event.languageBackToId(ownProps.language.id)],
    can: state.can.events
  };
};

const mapDispatchToProps = {
  ...eventActionCreators,
  addPeople,
  addLanguages,
  addClusters,
  setEventsCan
};

const LanguageEventsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguageEventsTable);

export default LanguageEventsContainer;
