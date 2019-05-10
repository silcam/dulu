import React from "react";
import styles from "../shared/MasterDetail.css";
import OrganizationsTable from "./OrganizationsTable";
import NewOrganizationForm from "./NewOrganizationForm";
import { Link } from "react-router-dom";
import AddIcon from "../shared/icons/AddIcon";
import FlexSpacer from "../shared/FlexSpacer";
import DuluAxios from "../../util/DuluAxios";
import OrganizationContainer from "./OrganizationContainer";
import GoBar from "../shared/GoBar";
import { Adder, Setter, SetCan } from "../../models/TypeBucket";
import { IOrganization } from "../../models/Organization";
import { ICan } from "../../actions/canActions";
import { History } from "history";
import I18nContext from "../../contexts/I18nContext";
import List from "../../models/List";

interface IProps {
  setOrganizations: Adder<IOrganization>;
  addOrganization: Setter<IOrganization>;
  setCan: SetCan;
  organizations: List<IOrganization>;
  id?: number;
  action?: string;
  history: History;
  can: ICan;
}

interface IState {}

export default class OrganizationsBoard extends React.PureComponent<
  IProps,
  IState
> {
  state: IState = {};

  async componentDidMount() {
    const data = await DuluAxios.get("/api/organizations");
    if (data) {
      this.props.setCan("organizations", data.can);
      this.props.setOrganizations(data.organizations);
    }
  }

  render() {
    return (
      <I18nContext.Consumer>
        {t => (
          <div className={styles.container}>
            <div className={styles.headerBar}>
              <h2>
                <Link to="/organizations">{t("Organizations")}</Link>
              </h2>
              {this.props.can.create && (
                <Link to="/organizations/new">
                  <AddIcon iconSize="large" />
                </Link>
              )}
              <GoBar />
              <FlexSpacer />
              <h3>
                <Link to="/people">{t("People")}</Link>
              </h3>
            </div>
            <div className={styles.masterDetailContainer}>
              <div className={styles.master}>
                <OrganizationsTable
                  id={this.props.id}
                  organizations={this.props.organizations}
                />
              </div>
              <div className={styles.detail}>
                {this.props.action == "new" && (
                  <NewOrganizationForm
                    addOrganization={this.props.addOrganization}
                    history={this.props.history}
                  />
                )}
                {this.props.action == "show" && (
                  <OrganizationContainer
                    key={this.props.id}
                    id={this.props.id!}
                    history={this.props.history}
                  />
                )}
                {!this.props.action && <span />}
              </div>
            </div>
          </div>
        )}
      </I18nContext.Consumer>
    );
  }
}
