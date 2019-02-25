import React from "react";
import PropTypes from "prop-types";
import MyOrganizationsTableRow from "./MyOrganizationsTableRow";
import SearchTextInput from "../shared/SearchTextInput";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import DuluAxios from "../../util/DuluAxios";
import InlineAddIcon from "../shared/icons/InlineAddIcon";

export default class MyOrganizationsTable extends React.PureComponent {
  state = {};

  async componentDidMount() {
    const data = await DuluAxios.get(`/api/organization_people`, {
      person_id: this.props.person.id
    });
    if (data) {
      this.props.addPeople(data.people);
      this.props.addOrganizations(data.organizations);
      this.props.addOrganizationPeople(data.organization_people);
    }
  }

  createOrganizationPerson = async () => {
    if (!this.state.newOrganization) return;
    const organizationPerson = {
      person_id: this.props.person.id,
      organization_id: this.state.newOrganization.id
    };
    const data = await DuluAxios.post("/api/organization_people", {
      organization_person: organizationPerson
    });
    if (data) {
      this.props.addOrganizations([data.organization]);
      this.props.setOrganizationPerson(data.organization_person);
      this.setState({ addingNew: false });
    }
  };

  render() {
    return (
      <div>
        <h3>
          {this.props.t("Organizations")}
          {this.props.person.can.update && (
            <InlineAddIcon onClick={() => this.setState({ addingNew: true })} />
          )}
        </h3>
        <table>
          <tbody>
            {this.props.organizationPeople.map(org_person => (
              <MyOrganizationsTableRow
                key={org_person.id}
                t={this.props.t}
                canUpdate={this.props.person.can.update}
                org_person={org_person}
                organization={
                  this.props.organizationsById[org_person.organization_id]
                }
                person={this.props.person}
                setOrganizationPerson={this.props.setOrganizationPerson}
                deleteOrganizationPerson={this.props.deleteOrganizationPerson}
              />
            ))}
            {this.state.addingNew && (
              <tr>
                <td colSpan="4">
                  <SearchTextInput
                    updateValue={org => this.setState({ newOrganization: org })}
                    queryPath="/api/organizations/search"
                    text={
                      this.state.newOrganization
                        ? this.state.newOrganization.name
                        : ""
                    }
                    autoFocus
                    allowBlank
                  />
                  <SmallSaveAndCancel
                    handleSave={this.createOrganizationPerson}
                    handleCancel={() => this.setState({ addingNew: false })}
                    t={this.props.t}
                    saveDisabled={!this.state.newOrganization}
                    style={{ marginTop: "8px" }}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

MyOrganizationsTable.propTypes = {
  person: PropTypes.object.isRequired,
  organizationPeople: PropTypes.array.isRequired,
  organizationsById: PropTypes.object.isRequired,

  t: PropTypes.func.isRequired,
  addOrganizationPeople: PropTypes.func.isRequired,
  setOrganizationPerson: PropTypes.func.isRequired,
  deleteOrganizationPerson: PropTypes.func.isRequired,
  addPeople: PropTypes.func.isRequired,
  addOrganizations: PropTypes.func.isRequired
};
