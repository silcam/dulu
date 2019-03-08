import React from "react";
import styles from "../shared/MasterDetail.css";
import OrganizationsTable from "./OrganizationsTable";
import NewOrganizationForm from "./NewOrganizationForm";
import { Link } from "react-router-dom";
import AddIcon from "../shared/icons/AddIcon";
import FlexSpacer from "../shared/FlexSpacer";
import PropTypes from "prop-types";
import DuluAxios from "../../util/DuluAxios";
import OrganizationContainer from "./OrganizationContainer";
import GoBar from "../shared/GoBar";

export default class OrganizationsBoard extends React.PureComponent {
  state = {};

  async componentDidMount() {
    const data = await DuluAxios.get("/api/organizations");
    if (data) {
      this.props.setCan("organizations", data.can);
      this.props.setOrganizations(data.organizations);
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.headerBar}>
          <h2>
            <Link to="/organizations">{this.props.t("Organizations")}</Link>
          </h2>
          {this.props.can.create && (
            <Link to="/organizations/new">
              <AddIcon iconSize="large" />
            </Link>
          )}
          <GoBar />
          <FlexSpacer />
          <h3>
            <Link to="/people">{this.props.t("People")}</Link>
          </h3>
        </div>
        <div className={styles.masterDetailContainer}>
          <div className={styles.master}>
            <OrganizationsTable
              t={this.props.t}
              id={this.props.id}
              organizations={this.props.organizations}
              can={this.props.can}
              filter={this.state.filter}
            />
          </div>
          <div className={styles.detail}>
            {this.props.action == "new" && (
              <NewOrganizationForm
                t={this.props.t}
                addOrganization={this.props.addOrganization}
                history={this.props.history}
              />
            )}
            {this.props.action == "show" && (
              <OrganizationContainer
                key={this.props.id}
                id={this.props.id}
                t={this.props.t}
                history={this.props.history}
              />
            )}
            {!this.props.action && <span />}
          </div>
        </div>
      </div>
    );
  }
}

OrganizationsBoard.propTypes = {
  setOrganizations: PropTypes.func.isRequired,
  addOrganization: PropTypes.func.isRequired,
  setCan: PropTypes.func.isRequired,

  organizations: PropTypes.array.isRequired,
  id: PropTypes.string,
  action: PropTypes.string,
  history: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  can: PropTypes.object.isRequired
};
