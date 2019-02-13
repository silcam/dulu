import { connect } from "react-redux";
import * as languageActionCreators from "../../actions/languageActions";
import LanguagePageRouter from "./LanguagePageRouter";

const mapStateToProps = (state, ownProps) => ({
  language: state.languages.byId[ownProps.id]
});

const LanguageContainer = connect(
  mapStateToProps,
  languageActionCreators
)(LanguagePageRouter);

export default LanguageContainer;
