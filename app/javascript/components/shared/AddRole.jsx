import React from "react";
import PropTypes from "prop-types";
import SelectInput from "./SelectInput";
import selectOptionsFromObject from "../../util/selectOptionsFromObject";
import AddIcon from "./icons/AddIcon";

export default class AddRole extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      role: Object.keys(props.t("roles"))[0]
    };
  }

  render() {
    const t = this.props.t;
    return (
      <div>
        <SelectInput
          value={this.state.role}
          options={selectOptionsFromObject(t("roles"))}
          handleChange={e => this.setState({ role: e.target.value })}
        />
        <AddIcon onClick={() => this.props.addRole(this.state.role)} />
      </div>
    );
  }
}

AddRole.propTypes = {
  t: PropTypes.func.isRequired,
  addRole: PropTypes.func.isRequired
};
