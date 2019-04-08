import React from "react";
import PropTypes from "prop-types";
import SelectInput from "../shared/SelectInput";
import DuluAxios from "../../util/DuluAxios";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";

export default class AddRoleRow extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      role: props.person.grantable_roles[0].value
    };
  }

  addRole = async () => {
    const data = await DuluAxios.post("/api/person_roles", {
      person_id: this.props.person.id,
      role: this.state.role
    });
    if (data) {
      this.props.replaceRoles(data.roles);
      this.props.cancel();
    }
  };

  handleRoleSelect = e => {
    this.setState({
      role: e.target.value
    });
  };

  render() {
    const t = this.props.t;
    return (
      <tr>
        <td>
          <SelectInput
            value={this.state.role}
            options={this.props.person.grantable_roles}
            setValue={role => this.setState({ role })}
            autoFocus
          />
          <SmallSaveAndCancel
            handleSave={this.addRole}
            handleCancel={this.props.cancel}
            t={t}
            style={{ marginTop: "8px" }}
          />
        </td>
      </tr>
    );
  }
}

AddRoleRow.propTypes = {
  person: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  replaceRoles: PropTypes.func.isRequired,

  cancel: PropTypes.func.isRequired
};
