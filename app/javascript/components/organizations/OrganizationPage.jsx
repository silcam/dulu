import React from "react";
import PersonActionBar from "../people/PersonActionBar";
import deepcopy from "../../util/deepcopy";
import TextOrEditText from "../shared/TextOrEditText";
import merge from "deepmerge";
import SaveIndicator from "../shared/SaveIndicator";
import DangerButton from "../shared/DangerButton";
import TextOrSearchInput from "../shared/TextOrSearchInput";
import TextOrTextArea from "../shared/TextOrTextArea";

console.warn(
  "Using PersonActionBar in OrganizationPage...this should be fixed"
);

export default class OrganizationPage extends React.PureComponent {
  state = {
    organization: deepcopy(this.props.organization)
  };

  updateOrganization = mergeOrg => {
    this.setState(prevState => ({
      organization: merge(prevState.organization, mergeOrg)
    }));
  };

  save = async () => {
    this.setState({ saving: true });
    const newOrganization = await this.props.update(this.state.organization);
    this.setState({
      editing: false,
      saving: false,
      savedChanges: true,
      organization: newOrganization
    });
  };

  render() {
    const organization = this.state.organization;

    return (
      <div>
        <PersonActionBar
          can={organization.can}
          editing={this.state.editing}
          t={this.props.t}
          edit={() => this.setState({ editing: true })}
          delete={() => this.setState({ deleting: true })}
          save={this.save}
          cancel={() =>
            this.setState({
              editing: false,
              person: deepcopy(this.props.person)
            })
          }
        />

        {this.state.deleting && (
          <DangerButton
            handleClick={() => {
              this.props.delete(organization.id);
            }}
            handleCancel={() => this.setState({ deleting: false })}
            message={this.props.t("delete_person_warning", {
              name: organization.short_name
            })}
            buttonText={this.props.t("delete_person", {
              name: organization.short_name
            })}
            t={this.props.t}
          />
        )}

        <SaveIndicator
          t={this.props.t}
          saving={this.state.saving}
          saved={this.state.savedChanges}
        />

        <h2>
          <TextOrEditText
            editing={this.state.editing}
            value={organization.short_name}
            updateValue={value =>
              this.updateOrganization({ short_name: value })
            }
          />
        </h2>

        <h3>
          <TextOrEditText
            editing={this.state.editing}
            value={organization.long_name}
            updateValue={value => {
              this.updateOrganization({ long_name: value });
            }}
          />
        </h3>

        <ul>
          <li>
            <strong>{this.props.t("Parent_organization")}:</strong>
            &nbsp;
            <TextOrSearchInput
              editing={this.state.editing}
              text={organization.parent.name}
              updateValue={(id, name) =>
                this.updateOrganization({
                  parent: {
                    id: id,
                    name: name
                  },
                  parent_id: id
                })
              }
              queryPath="/api/organizations/search"
            />
          </li>
          <li>
            <strong>{this.props.t("Country")}:</strong>
            &nbsp;
            <TextOrSearchInput
              editing={this.state.editing}
              text={organization.country.name}
              queryPath="/api/countries/search"
              updateValue={(id, name) =>
                this.updateOrganization({
                  country: {
                    name: name,
                    id: id
                  },
                  country_id: id
                })
              }
            />
          </li>
        </ul>
        <p>
          <TextOrTextArea
            editing={this.state.editing}
            value={organization.description}
            updateValue={value =>
              this.updateOrganization({ description: value })
            }
          />
        </p>
      </div>
    );
  }
}
