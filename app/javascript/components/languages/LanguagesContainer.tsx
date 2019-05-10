import { connect } from "react-redux";
import * as languagesActionCreators from "../../actions/languageActions";
import LanguagesBoard from "./LanguagesBoard";
import { setCan } from "../../actions/canActions";
import { AppState } from "../../reducers/appReducer";

const mapStateToProps = (state: AppState) => ({
  languages: state.languages,
  can: state.can.languages
});

const LanguagesContainer = connect(
  mapStateToProps,
  { ...languagesActionCreators, setCan }
)(LanguagesBoard);

export default LanguagesContainer;
