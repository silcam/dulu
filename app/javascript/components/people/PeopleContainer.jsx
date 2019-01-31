import { connect } from "react-redux";
import * as peopleActionCreators from "../../actions/peopleActions";
import PeopleBoard from "./PeopleBoard";

const mapStateToProps = state => ({
  people: state.people.list.map(id => state.people.byId[id])
});

const mapDispatchToProps = peopleActionCreators;

const PeopleContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PeopleBoard);

export default PeopleContainer;
