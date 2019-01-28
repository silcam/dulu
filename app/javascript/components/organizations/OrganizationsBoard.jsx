import React from "react";
import styles from "../shared/MasterDetail.css";
import Loading from "../shared/Loading";
import thingBoard from "../shared/thingBoard";
import OrganizationsTable from "./OrganizationsTable";
import NewOrganizationForm from "./NewOrganizationForm";
import { organizationCompare } from "../../models/organization";
import OrganizationPage from "./OrganizationPage";
import { Link } from "react-router-dom";
import AddIcon from "../shared/icons/AddIcon";
import TextFilter from "../shared/TextFilter";
import FlexSpacer from "../shared/FlexSpacer";

class Board extends React.PureComponent {
  state = {};

  render() {
    const selectedOrganization = this.props.selected;
    return (
      <div className={styles.container}>
        <div className={styles.headerBar}>
          <h2>
            <Link to="/organizations">{this.props.t("Organizations")}</Link>
          </h2>

          <TextFilter
            placeholder={this.props.t("Find")}
            updateFilter={filter => this.setState({ filter: filter })}
          />
          {this.props.can.create && (
            <Link to="/organizations/new">
              <AddIcon iconSize="large" />
            </Link>
          )}
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
                saving={this.props.savingNew}
                addOrganization={this.props.add}
              />
            )}
            {this.props.action == "show" &&
              selectedOrganization &&
              (selectedOrganization.loaded ? (
                <OrganizationPage
                  key={selectedOrganization.id}
                  organization={selectedOrganization}
                  t={this.props.t}
                  update={this.props.update}
                  delete={this.props.delete}
                />
              ) : (
                <Loading t={this.props.t} />
              ))}
            {!this.props.action && <span />}
          </div>
        </div>
      </div>
    );
  }
}

const OrganizationsBoard = thingBoard(Board, {
  name: "organization",
  compare: organizationCompare
});

export default OrganizationsBoard;
