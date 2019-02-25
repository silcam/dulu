import React from "react";
import PropTypes from "prop-types";
import DuluAxios from "../../util/DuluAxios";
import update from "immutability-helper";

export default class IfAllowed extends React.PureComponent {
  async componentDidMount() {
    const props = this.props;
    if (props.can[props.permission] === undefined) {
      const type = props.permission.slice(0, props.permission.indexOf(":"));
      const doWhat = props.permission.slice(props.permission.indexOf(":") + 1);
      const result = await DuluAxios.get("/api/permissions/check", {
        type: type,
        doWhat: doWhat
      });
      if (result) {
        props.setCan(
          update(props.can, {
            [props.permission]: { $set: result }
          })
        );
      }
    }
  }

  render() {
    const props = this.props;
    return props.can[props.permission] ? props.children : "";
  }
}

IfAllowed.propTypes = {
  can: PropTypes.object.isRequired,
  permission: PropTypes.string.isRequired, // Format "Event:create"
  setCan: PropTypes.func.isRequired
};
