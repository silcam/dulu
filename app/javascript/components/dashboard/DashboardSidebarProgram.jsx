import React from "react";
import PropTypes from "prop-types";
import style from "./Dashboard.css";

export default class DashboardSidebarProgram extends React.PureComponent {
  componentDidMount() {
    if (this.props.language.startSelected) {
      this.props.onProgramSelected(this.props.language);
    }
  }

  render() {
    const props = this.props;
    const indent = props.indent || 0;
    const indentString = new Array(indent).fill("\u00A0").join(""); // \u00A0 = Non-breaking space
    return (
      <li
        className={
          "languageItem " + (props.selection == props.language && style.active)
        }
      >
        {indentString}
        <button
          className="link"
          onClick={() => {
            props.onProgramSelected(props.language);
          }}
        >
          {props.language.name}
        </button>
      </li>
    );
  }
}

DashboardSidebarProgram.propTypes = {
  language: PropTypes.object.isRequired,
  onProgramSelected: PropTypes.func.isRequired
};
