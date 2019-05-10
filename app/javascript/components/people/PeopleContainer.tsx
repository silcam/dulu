import { connect } from "react-redux";
import * as peopleActionCreators from "../../actions/peopleActions";
import PeopleBoard from "./PeopleBoard";
import { setCan } from "../../actions/canActions";
import { AppState } from "../../reducers/appReducer";

const mapStateToProps = (state: AppState) => ({
  people: state.people,
  can: state.can.people
});

const mapDispatchToProps = { ...peopleActionCreators, setCan };

const PeopleContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PeopleBoard);

export default PeopleContainer;
