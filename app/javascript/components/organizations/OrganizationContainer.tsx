import { connect } from "react-redux";
import * as organizationActionCreators from "../../actions/organizationActions";
import OrganizationPage from "./OrganizationPage";
import { AppState } from "../../reducers/appReducer";

interface IProps {
  id: number;
}

const mapStateToProps = (state: AppState, ownProps: IProps) => ({
  organization: state.organizations.get(ownProps.id),
  organizations: state.organizations
});

const OrganizationContainer = connect(
  mapStateToProps,
  organizationActionCreators
)(OrganizationPage);

export default OrganizationContainer;
