import { connect } from "react-redux";
import * as organizationActionCreators from "../../actions/organizationActions";
import OrganizationsBoard from "./OrganizationsBoard";
import { setCan } from "../../actions/canActions";
import { AppState } from "../../reducers/appReducer";
import { IOrganization } from "../../models/Organization";

const mapStateToProps = (state: AppState) => ({
  organizations: state.organizations.list.map(
    id => state.organizations.byId[id]
  ) as IOrganization[],
  can: state.can.organizations
});

const OrganizationsContainer = connect(
  mapStateToProps,
  { ...organizationActionCreators, setCan }
)(OrganizationsBoard);

export default OrganizationsContainer;
