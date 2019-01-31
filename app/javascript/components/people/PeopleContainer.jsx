import { connect } from "react-redux";
import * as peopleActionCreators from "../../actions/peopleActions";
import PeopleBoard from "./PeopleBoard";

const mapStateToProps = state => ({
  people: state.people.peopleIds.map(id => state.people.peopleById[id])
});

const mapDispatchToProps = peopleActionCreators;

const PeopleContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PeopleBoard);

export default PeopleContainer;
