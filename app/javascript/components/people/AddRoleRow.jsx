import React from "react";

import AddIconButton from "../shared/AddIconButton";
import SelectInput from "../shared/SelectInput";
import SmallAddButton from "../shared/SmallAddButton";
import SmallCancelButton from "../shared/SmallCancelButton";

class AddRoleRow extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      adding: false,
      role: props.person.grantable_roles[0].value
    };
  }

  setAddingMode = () => {
    this.setState({
      adding: true
    });
  };

  cancelAddingMode = () => {
    this.setState({
      adding: false
    });
  };

  addRole = () => {
    let url = "/api/person_roles";
    let data = {
      person_id: this.props.person.id,
      role: this.state.role
    };
    this.props.rawPost(url, data);
    this.setState({ adding: false });
  };

  handleRoleSelect = e => {
    this.setState({
      role: e.target.value
    });
  };

  render() {
    const t = this.props.t;
    if (this.state.adding) {
      return (
        <tr>
          <td>
            <SelectInput
              value={this.state.role}
              options={this.props.person.grantable_roles}
              handleChange={this.handleRoleSelect}
              autoFocus
            />
          </td>
          <td>
            <SmallAddButton handleClick={this.addRole} t={t} />
            &nbsp;
            <SmallCancelButton handleClick={this.cancelAddingMode} t={t} />
          </td>
        </tr>
      );
    }
    return (
      <tr>
        <td colSpan="2">
          <AddIconButton handleClick={this.setAddingMode} />
        </td>
      </tr>
    );
  }
}

export default AddRoleRow;
