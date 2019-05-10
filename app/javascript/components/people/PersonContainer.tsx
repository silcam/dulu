import { connect } from "react-redux";
import * as peopleActionCreators from "../../actions/peopleActions";
import PersonPage from "./PersonPage";
import { AppState } from "../../reducers/appReducer";

interface IProps {
  id: number;
}

const mapStateToProps = (state: AppState, ownProps: IProps) => ({
  person: state.people.get(ownProps.id)
});

const PersonContainer = connect(
  mapStateToProps,
  peopleActionCreators
)(PersonPage);

export default PersonContainer;
