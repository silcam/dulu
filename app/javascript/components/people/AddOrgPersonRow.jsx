import React from "react";

import AddIconButton from "../shared/AddIconButton";
import { SearchTextGroup } from "../shared/formGroup";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import update from "immutability-helper";

class AddOrgPersonRow extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      organization_id: null
    };
  }

  edit = () => {
    this.setState({ editing: true });
  };

  cancelEdit = () => {
    this.setState({ editing: false });
  };

  setOrg = id => {
    this.setState({ organization_id: id });
  };

  save = () => {
    const person = this.props.person;
    const data = {
      organization_person: {
        person_id: person.id,
        organization_id: this.state.organization_id
      }
    };
    this.props.rawPost("/api/organization_people", data, response => {
      const newOrgPerson = response.data.organization_person;
      const newPerson = update(person, {
        organization_people: {
          $push: [newOrgPerson]
        }
      });
      this.props.updateModel(newPerson);
    });
    this.setState({ editing: false });
  };

  render() {
    if (this.state.editing) {
      return (
        <tr>
          <td colSpan="4">
            <SearchTextGroup
              queryPath={"/api/organizations/search"}
              save={this.setOrg}
              cancel={() => {}}
              placeholder={this.props.t("Organization")}
              autoFocus
              allowBlank
            />
            <SmallSaveAndCancel
              handleSave={this.save}
              handleCancel={this.cancelEdit}
              t={this.props.t}
            />
          </td>
        </tr>
      );
    } else {
      return (
        <tr>
          <td colSpan="4">
            <AddIconButton handleClick={this.edit} />
          </td>
        </tr>
      );
    }
  }
}

export default AddOrgPersonRow;
