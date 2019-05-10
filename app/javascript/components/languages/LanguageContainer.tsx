import { connect } from "react-redux";
import * as languageActionCreators from "../../actions/languageActions";
import LanguagePageRouter from "./LanguagePageRouter";
import { AppState } from "../../reducers/appReducer";

interface IProps {
  id: number;
}

const mapStateToProps = (state: AppState, ownProps: IProps) => ({
  language: state.languages.get(ownProps.id)
});

const LanguageContainer = connect(
  mapStateToProps,
  languageActionCreators
)(LanguagePageRouter);

export default LanguageContainer;
