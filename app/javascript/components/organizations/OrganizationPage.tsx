import React from "react";
import EditActionBar from "../shared/EditActionBar";
import deepcopy from "../../util/deepcopy";
import TextOrEditText from "../shared/TextOrEditText";
import merge from "deepmerge";
import SaveIndicator from "../shared/SaveIndicator";
import DangerButton from "../shared/DangerButton";
import TextOrSearchInput from "../shared/TextOrSearchInput";
import TextOrTextArea from "../shared/TextOrTextArea";
import SearchTextInput from "../shared/SearchTextInput";
import { Link } from "react-router-dom";
import DuluAxios from "../../util/DuluAxios";
import Loading from "../shared/Loading";
import { IOrganization } from "../../models/Organization";
import { Setter, ById } from "../../models/TypeBucket";
import { History } from "history";
import I18nContext from "../../application/I18nContext";

interface IProps {
  id: number;
  organization?: IOrganization;
  organizations: ById<IOrganization>;
  setOrganization: Setter<IOrganization>;
  deleteOrganization: (id: number) => void;
  history: History;
}

interface IState {
  organization?: IOrganization;
  editing?: boolean;
  saving?: boolean;
  savedChanges?: boolean;
  deleting?: boolean;
}

export default class OrganizationPage extends React.PureComponent<
  IProps,
  IState
> {
  state: IState = {};

  async componentDidMount() {
    const data = await DuluAxios.get(`/api/organizations/${this.props.id}`);
    if (data) {
      this.props.setOrganization(data.organization);
      this.setState({ organization: data.organization });
    }
  }

  updateOrganization = (mergeOrg: Partial<IOrganization>) => {
    this.setState(prevState => ({
      organization: merge(prevState.organization, mergeOrg)
    }));
  };

  edit = () =>
    this.setState({
      organization: deepcopy(this.props.organization),
      editing: true
    });

  save = async () => {
    if (!this.validate()) return;
    this.setState({ saving: true });
    const data = await DuluAxios.put(`/api/organizations/${this.props.id}`, {
      organization: this.state.organization
    });
    if (data) {
      this.props.setOrganization(data.organization);
      this.setState({
        editing: false,
        saving: false,
        savedChanges: true,
        organization: data.organization
      });
    }
  };

  delete = async () => {
    const success = await DuluAxios.delete(
      `/api/organizations/${this.props.id}`
    );
    if (success) {
      this.props.history.push("/organizations");
      this.props.deleteOrganization(this.props.id);
    }
  };

  validate = () => {
    return (
      this.state.organization && this.state.organization.short_name.length > 0
    );
  };

  render() {
    const organization = this.state.editing
      ? this.state.organization
      : this.props.organization;

    if (!organization) return <Loading />;

    const parent = organization.parent_id
      ? this.props.organizations[organization.parent_id]
      : null;

    return (
      <I18nContext.Consumer>
        {t => (
          <div>
            <EditActionBar
              can={organization.can}
              editing={this.state.editing}
              edit={this.edit}
              delete={() => this.setState({ deleting: true })}
              save={this.save}
              cancel={() =>
                this.setState({
                  editing: false
                })
              }
            />

            {this.state.deleting && (
              <DangerButton
                handleClick={this.delete}
                handleCancel={() => this.setState({ deleting: false })}
                message={t("delete_person_warning", {
                  name: organization.short_name
                })}
                buttonText={t("delete_person", {
                  name: organization.short_name
                })}
              />
            )}

            <SaveIndicator
              saving={this.state.saving}
              saved={this.state.savedChanges}
            />

            <h2>
              <TextOrEditText
                editing={this.state.editing}
                name="short_name"
                value={organization.short_name}
                setValue={value =>
                  this.updateOrganization({ short_name: value })
                }
                validateNotBlank
              />
            </h2>

            <h3>
              <TextOrEditText
                editing={this.state.editing}
                value={organization.long_name || ""}
                label={t("Long_name")}
                setValue={value => {
                  this.updateOrganization({ long_name: value });
                }}
              />
            </h3>

            <ul>
              <li>
                <strong>{t("Parent_organization")}:</strong>
                &nbsp;
                {this.state.editing ? (
                  <SearchTextInput
                    editing={this.state.editing}
                    text={parent ? parent.short_name : ""}
                    updateValue={(org: Partial<IOrganization>) =>
                      this.updateOrganization({
                        parent_id: org.id
                      })
                    }
                    queryPath="/api/organizations/search"
                    allowBlank
                  />
                ) : (
                  parent && (
                    <Link to={`/organizations/${parent.id}`}>
                      {parent.short_name}
                    </Link>
                  )
                )}
              </li>
              <li>
                <strong>{t("Country")}:</strong>
                &nbsp;
                <TextOrSearchInput
                  editing={this.state.editing}
                  text={organization.country ? organization.country.name : ""}
                  queryPath="/api/countries/search"
                  updateValue={country =>
                    this.updateOrganization({
                      country: country,
                      country_id: country.id
                    })
                  }
                  allowBlank
                />
              </li>
            </ul>
            <div style={{ marginTop: "16px" }}>
              <TextOrTextArea
                editing={this.state.editing}
                label={t("Description")}
                value={organization.description}
                setValue={value =>
                  this.updateOrganization({ description: value })
                }
              />
            </div>
          </div>
        )}
      </I18nContext.Consumer>
    );
  }
}
