import { connect } from "react-redux";
import * as languagesActionCreators from "../../actions/languageActions";
import LanguagesBoard from "./LanguagesBoard";
import { setCan } from "../../actions/canActions";

const mapStateToProps = state => ({
  languages: state.languages.list.map(id => state.languages.byId[id]),
  can: state.can.languages
});

const LanguagesContainer = connect(
  mapStateToProps,
  { ...languagesActionCreators, setCan }
)(LanguagesBoard);

export default LanguagesContainer;
