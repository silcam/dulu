import { connect } from "react-redux";
import * as languagesActionCreators from "../../actions/languageActions";
import LanguagesBoard from "./LanguagesBoard";

const mapStateToProps = state => ({
  languages: state.languages.list.map(id => state.languages.byId[id])
});

const LanguagesContainer = connect(
  mapStateToProps,
  languagesActionCreators
)(LanguagesBoard);

export default LanguagesContainer;
