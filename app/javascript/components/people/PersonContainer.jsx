import { connect } from "react-redux";
import * as peopleActionCreators from "../../actions/peopleActions";
import PersonPage from "./PersonPage";

const mapStateToProps = (state, ownProps) => ({
  person: state.people.byId[ownProps.id]
});

const PersonContainer = connect(
  mapStateToProps,
  peopleActionCreators
)(PersonPage);

export default PersonContainer;
