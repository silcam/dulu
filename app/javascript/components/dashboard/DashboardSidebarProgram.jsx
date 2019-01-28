import React from "react";
import PropTypes from "prop-types";
import style from "./Dashboard.css";

export default class DashboardSidebarProgram extends React.PureComponent {
  componentDidMount() {
    if (this.props.program.startSelected) {
      this.props.onProgramSelected(this.props.program);
    }
  }

  render() {
    const props = this.props;
    const indent = props.indent || 0;
    const indentString = new Array(indent).fill("\u00A0").join(""); // \u00A0 = Non-breaking space
    return (
      <li
        className={
          "programItem " + (props.selection == props.program && style.active)
        }
      >
        {indentString}
        <button
          className="link"
          onClick={() => {
            props.onProgramSelected(props.program);
          }}
        >
          {props.program.name}
        </button>
      </li>
    );
  }
}

DashboardSidebarProgram.propTypes = {
  program: PropTypes.object.isRequired,
  onProgramSelected: PropTypes.func.isRequired
};
