import React from "react";
import SelectInput from "../shared/SelectInput";
import DuluAxios from "../../util/DuluAxios";
import SmallSaveAndCancel from "../shared/SmallSaveAndCancel";
import { IPerson, Role } from "../../models/Person";

interface IProps {
  person: IPerson;
  replaceRoles: (roles: Role[]) => void;
  cancel: () => void;
}

interface IState {
  role: string;
}

export default class AddRoleRow extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
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

  render() {
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
            style={{ marginTop: "8px" }}
          />
        </td>
      </tr>
    );
  }
}
