import { connect } from "react-redux";
import * as eventActionCreators from "../../actions/eventActions";
import { addPeople } from "../../actions/peopleActions";
import { addLanguages } from "../../actions/languageActions";
import { addClusters } from "../../actions/clusterActions";
import { setCan } from "../../actions/canActions";
import Event from "../../models/Event";
import PersonEventsTable from "./PersonEventsTable";

const mapStateToProps = (state, ownProps) => ({
  events: Object.values(state.events.byId)
    .filter(event =>
      event.event_participants.some(e_p => e_p.person_id == ownProps.person.id)
    )
    .sort(Event.revCompare),
  eventsBackTo: state.events.backTo[Event.personBackToId(ownProps.person.id)],
  can: state.can.events
});

const mapDispatchToProps = {
  ...eventActionCreators,
  addPeople,
  addLanguages,
  addClusters,
  setCan
};

const PersonEventsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PersonEventsTable);

export default PersonEventsContainer;
