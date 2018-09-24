import React from "react";
import MyOrganizationsTableRow from "./MyOrganizationsTableRow";
import Axios from "axios";
import { findIndexById } from "../../util/findById";
import update from "immutability-helper";
import AddIcon from "../shared/icons/AddIcon";
import SearchTextInput from "../shared/SearchTextInput";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import { axiosDelete, statusOK } from "../../util/network";

export default class MyOrganizationsTable extends React.PureComponent {
  state = {};

  createOrganizationPerson = async () => {
    if (!this.state.newOrganization) return;
    const organizationPerson = {
      person_id: this.props.person.id,
      organization_id: this.state.newOrganization.id
    };
    const response = await Axios.post("/api/organization_people", {
      authenticity_token: this.props.authToken,
      organization_person: organizationPerson
    });
    if (response.data.organization_person) {
      const newOrganizationPerson = response.data.organization_person;
      this.props.replaceOrganizationPeople(
        update(this.props.person.organization_people, {
          $push: [newOrganizationPerson]
        })
      );
      this.setState({ addingNew: false });
    }
  };

  updateOrganizationPerson = async organizationPerson => {
    const response = await Axios.put(
      `/api/organization_people/${organizationPerson.id}`,
      {
        authenticity_token: this.props.authToken,
        organization_person: organizationPerson
      }
    );
    if (response.data.organization_person) {
      const newOrganizationPerson = response.data.organization_person;
      this.props.replaceOrganizationPeople(
        update(this.props.person.organization_people, {
          [findIndexById(
            this.props.person.organization_people,
            newOrganizationPerson.id
          )]: { $set: newOrganizationPerson }
        })
      );
    }
  };

  deleteOrganizationPerson = async id => {
    const response = await axiosDelete(`/api/organization_people/${id}`, {
      authenticity_token: this.props.authToken
    });
    if (statusOK(response)) {
      const index = findIndexById(this.props.person.organization_people, id);
      this.props.replaceOrganizationPeople(
        update(this.props.person.organization_people, {
          $splice: [[index, 1]]
        })
      );
    }
  };

  render() {
    return (
      <div>
        <h3>
          {this.props.t("Organizations")}{" "}
          <AddIcon onClick={() => this.setState({ addingNew: true })} />{" "}
        </h3>
        <table>
          <tbody>
            {this.props.person.organization_people.map(org_person => (
              <MyOrganizationsTableRow
                key={org_person.id}
                t={this.props.t}
                editing={this.props.editing}
                org_person={org_person}
                updateOrganizationPerson={this.updateOrganizationPerson}
                deleteOrganizationPerson={this.deleteOrganizationPerson}
              />
            ))}
            {this.state.addingNew && (
              <tr>
                <td colSpan="4">
                  <SearchTextInput
                    updateValue={(id, name) =>
                      this.setState({ newOrganization: { id: id, name: name } })
                    }
                    queryPath="/api/organizations/search"
                    autoFocus
                  />
                  <SmallSaveAndCancel
                    handleSave={this.createOrganizationPerson}
                    handleCancel={() => this.setState({ addingNew: false })}
                    t={this.props.t}
                    saveDisabled={!this.state.newOrganization}
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
