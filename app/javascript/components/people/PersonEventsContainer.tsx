import { connect } from "react-redux";
import * as eventActionCreators from "../../actions/eventActions";
import { addPeople } from "../../actions/peopleActions";
import { addLanguages } from "../../actions/languageActions";
import { addClusters } from "../../actions/clusterActions";
import { setCan } from "../../actions/canActions";
import Event from "../../models/Event";
import PersonEventsTable from "./PersonEventsTable";
import { AppState } from "../../reducers/appReducer";
import { IPerson } from "../../models/Person";

interface IProps {
  person: IPerson;
}

const mapStateToProps = (state: AppState, ownProps: IProps) => ({
  events: state.events.list
    .filter(event =>
      event!.event_participants.some(e_p => e_p.person_id == ownProps.person.id)
    )
    .reverse(),
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
