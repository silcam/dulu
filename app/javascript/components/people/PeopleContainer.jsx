import { connect } from "react-redux";
import * as peopleActionCreators from "../../actions/peopleActions";
import PeopleBoard from "./PeopleBoard";
import { setCan } from "../../actions/canActions";

const mapStateToProps = state => ({
  people: state.people.list.map(id => state.people.byId[id]),
  can: state.can.people
});

const mapDispatchToProps = { ...peopleActionCreators, setCan };

const PeopleContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PeopleBoard);

export default PeopleContainer;
